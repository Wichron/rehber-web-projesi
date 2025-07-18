document.addEventListener("DOMContentLoaded", () => {
  const cityInput = document.getElementById("cityInput");
  const sorBtn = document.getElementById("sorBtn");
  const cevap = document.getElementById("cevap");
  const searchHistory = document.getElementById("searchHistory");

  // Elemanların varlığını kontrol et
  if (!cityInput) console.error("Hata: cityInput elemanı bulunamadı!");
  if (!sorBtn) console.error("Hata: sorBtn elemanı bulunamadı!");
  if (!cevap) console.error("Hata: cevap elemanı bulunamadı!");
  if (!searchHistory) console.error("Hata: searchHistory elemanı bulunamadı!");

  // Kullanıcıya özgü arama geçmişini yükleme
  window.loadSearchHistory = () => {
    const username = localStorage.getItem("username");
    console.log("loadSearchHistory: username =", username);
    if (!username) {
      console.log("loadSearchHistory: Kullanıcı giriş yapmamış, geçmiş yüklenmiyor.");
      searchHistory.innerHTML = "";
      return;
    }

    const historyKey = `searchHistory_${username}`;
    const history = JSON.parse(localStorage.getItem(historyKey) || "[]") || [];
    console.log("loadSearchHistory: Geçmiş =", history);
    searchHistory.innerHTML = ""; // Önceki geçmişi temizle
    history.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      li.addEventListener("click", () => {
        console.log("Geçmiş öğesine tıklandı:", item);
        cityInput.value = item;
        searchCity(item);
      });
      searchHistory.appendChild(li);
    });
  };

  // Arama geçmişine ekleme
  const addToSearchHistory = (city) => {
    const username = localStorage.getItem("username");
    console.log("addToSearchHistory: username =", username, "city =", city);
    if (!username) {
      console.log("addToSearchHistory: Kullanıcı giriş yapmamış, geçmiş kaydedilmiyor.");
      return;
    }

    if (!city) {
      console.log("addToSearchHistory: Şehir boş, kaydedilmedi.");
      return;
    }

    const historyKey = `searchHistory_${username}`;
    let history = JSON.parse(localStorage.getItem(historyKey) || "[]") || [];
    if (!history.includes(city)) {
      history.unshift(city); // Yeni aramayı başa ekle
      if (history.length > 10) history.pop(); // Maksimum 10 kayıt tut
      localStorage.setItem(historyKey, JSON.stringify(history));
      console.log("addToSearchHistory: Yeni geçmiş =", history);
      loadSearchHistory(); // Geçmişi güncelle
    }
  };

  // Şehir arama fonksiyonu
  const searchCity = async (city) => {
    console.log("searchCity: Arama yapılıyor, şehir =", city);
    addToSearchHistory(city); // API'den bağımsız olarak geçmişi kaydet
    try {
      cevap.textContent = "Yükleniyor...";
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: '${city} şehri hakkında tarihi, siyasi, kültürel bilgiler ver ve gezilecek yerler öner.' }),
      });
      const data = await response.json();
      cevap.textContent = data.response || "Bilgi bulunamadı.";
    } catch (error) {
      console.error("searchCity: Hata:", error);
      cevap.textContent = "Bir hata oluştu. Lütfen tekrar deneyin.";
    }
  };

  // Arama butonuna olay dinleyicisi
  if (sorBtn) {
    sorBtn.addEventListener("click", () => {
      const city = cityInput.value.trim();
      console.log("sorBtn: Tıklandı, şehir =", city);
      if (city) {
        searchCity(city);
      } else {
        console.log("sorBtn: Şehir boş, arama yapılmadı.");
      }
    });
  }

  // Enter tuşu ile arama
  if (cityInput) {
    cityInput.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        const city = cityInput.value.trim();
        console.log("cityInput: Enter tuşuna basıldı, şehir =", city);
        if (city) {
          searchCity(city);
        } else {
          console.log("cityInput: Şehir boş, arama yapılmadı.");
        }
      }
    });
  }

  // İlk yüklemede geçmişi yükle
  console.log("response.js: Sayfa yüklendi, loadSearchHistory çağrılıyor.");
  window.loadSearchHistory();
});

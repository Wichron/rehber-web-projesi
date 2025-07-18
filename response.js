document.addEventListener("DOMContentLoaded", () => {
  const cityInput = document.getElementById("cityInput");
  const sorBtn = document.getElementById("sorBtn");
  const searchHistory = document.getElementById("searchHistory");
  const replyDiv = document.getElementById("aiReply"); // Cevapların gösterileceği yer

  // URL'den gelen cevap parametresini al ve göster
  const cevapMetni = new URLSearchParams(window.location.search).get("cevap");

  if (cevapMetni && replyDiv) {
    replyDiv.textContent = decodeURIComponent(cevapMetni);
  } else if (replyDiv) {
    replyDiv.textContent = "Yanıt alınamadı veya mesaj iletilmedi.";
  }

  // Elemanların varlığını kontrol et
  if (!cityInput) console.warn("Hata: cityInput elemanı bulunamadı!");
  if (!sorBtn) console.warn("Hata: sorBtn elemanı bulunamadı!");
  if (!searchHistory) console.warn("Hata: searchHistory elemanı bulunamadı!");

  // Kullanıcıya özgü arama geçmişini yükle
  window.loadSearchHistory = () => {
    const username = localStorage.getItem("username");
    if (!username) {
      searchHistory.innerHTML = "";
      return;
    }

    const historyKey = `searchHistory_${username}`;
    const history = JSON.parse(localStorage.getItem(historyKey) || "[]");
    searchHistory.innerHTML = ""; // Önceki geçmişi temizle

    history.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      li.addEventListener("click", () => {
        cityInput.value = item;
        searchCity(item);
      });
      searchHistory.appendChild(li);
    });
  };

  // Arama geçmişine ekle
  const addToSearchHistory = (city) => {
    const username = localStorage.getItem("username");
    if (!username || !city) return;

    const historyKey = `searchHistory_${username}`;
    let history = JSON.parse(localStorage.getItem(historyKey) || "[]");

    if (!history.includes(city)) {
      history.unshift(city);
      if (history.length > 10) history.pop();
      localStorage.setItem(historyKey, JSON.stringify(history));
      loadSearchHistory(); // Güncelle
    }
  };

  // Şehir arama fonksiyonu (response.html'de doğrudan tekrar arama yapılırsa)
  const searchCity = async (city) => {
    replyDiv.textContent = "Yükleniyor...";
    addToSearchHistory(city);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `${city} şehri hakkında tarihi, siyasi, kültürel bilgiler ver ve gezilecek yerler öner.`
        }),
      });

      const data = await response.json();
      replyDiv.textContent = data.response || "Bilgi bulunamadı.";
    } catch (error) {
      console.error("searchCity: Hata:", error);
      replyDiv.textContent = "Bir hata oluştu. Lütfen tekrar deneyin.";
    }
  };

  // Butonla arama
  if (sorBtn && cityInput) {
    sorBtn.addEventListener("click", () => {
      const city = cityInput.value.trim();
      if (city) searchCity(city);
    });
  }

  // Enter tuşu ile arama
  if (cityInput) {
    cityInput.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        const city = cityInput.value.trim();
        if (city) searchCity(city);
      }
    });
  }

  // Sayfa yüklenince arama geçmişini göster
  window.loadSearchHistory();
});

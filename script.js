document.addEventListener("DOMContentLoaded", () => {
  const cityInput = document.getElementById("cityInput");
  const sorBtn = document.getElementById("sorBtn");
  const searchHistory = document.getElementById("searchHistory");
  

  if (!cityInput) console.error("cityInput bulunamadı!");
  if (!sorBtn) console.error("sorBtn bulunamadı!");
  if (!searchHistory) console.error("searchHistory bulunamadı!");

  // 🔐 Çift tıklama engelleme için kilit
  let isSearching = false;

  const searchCity = async (city) => {
    if (isSearching) {
      console.warn("Zaten bir arama yapılıyor, tekrar başlatılmadı.");
      return;
    }

    isSearching = true;
    console.log("searchCity: Arama yapılıyor, şehir =", city);

    if (localStorage.getItem("username")) {
      addToSearchHistory(city);
    }

    try {
      // API çağrısı
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: `${city} Şehri hakkında tarihi, siyasi, kültürel bilgiler ver ve gezilecek yerler öner.`
        })
      });

      const data = await response.json();
      console.log("🟢 Sunucudan dönen veri:", data);

      console.log("❓ data.reply:", data.reply);

      if (data.reply && data.reply.length > 0) {
        const encodedResponse = encodeURIComponent(data.reply);
        window.location.href = `response.html?cevap=${encodedResponse}`;
      } else {
        const errorMessage = encodeURIComponent(`⚠️ Hata: ${data.error || "Yanıt alınamadı."}`);
        window.location.href = `response.html?cevap=${errorMessage}`;
      }
      
    } catch (error) {
      console.error("❌ İstek hatası:", error);
      // Hata durumunda response.html'ye hata mesajıyla yönlendir
      const errorMessage = encodeURIComponent("🚨 Bir hata oluştu. Sunucuya erişilemedi.");
      window.location.href = `response.html?cevap=${errorMessage}`;
    }
  };

  
  // Arama geçmişine ekleme (kısaltılmış)
  const addToSearchHistory = (city) => {
    const username = localStorage.getItem("username");
    if (!username || !city) return;
    const key = `searchHistory_${username}`;
    let history = JSON.parse(localStorage.getItem(key) || "[]");
    if (!history.includes(city)) {
      history.unshift(city);
      if (history.length > 10) history.pop();
      localStorage.setItem(key, JSON.stringify(history));
    }
  };

  // Arama butonuna tıklama
  sorBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (city) {
      searchCity(city);
    } else {
      console.log("Şehir boş.");
    }
  });

  // Enter tuşu ile arama
  cityInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      const city = cityInput.value.trim();
      if (city) {
        searchCity(city);
      }
    }
  });
});

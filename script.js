document.addEventListener("DOMContentLoaded", () => {
  const cityInput = document.getElementById("cityInput");
  const sorBtn = document.getElementById("sorBtn");
  const searchHistory = document.getElementById("searchHistory");
  const spinner = document.getElementById("spinner");

  if (!cityInput) console.error("cityInput bulunamadı!");
  if (!sorBtn) console.error("sorBtn bulunamadı!");
  if (!searchHistory) console.error("searchHistory bulunamadı!");

  function showLoadingBar() {
    const bar = document.getElementById("loadingBarContainer");
    if (bar) bar.style.display = "block";
  }

  function hideLoadingBar() {
    const bar = document.getElementById("loadingBarContainer");
    if (bar) bar.style.display = "none";
  }

  // 🔐 Çift tıklama engelleme için kilit
  let isSearching = false;

  const searchCity = async (city) => {
    if (isSearching) {
      console.warn("Zaten bir arama yapılıyor, tekrar başlatılmadı.");
      return;
    }

    isSearching = true;
    console.log("searchCity: Arama yapılıyor, şehir =", city);

    // 🔄 Spinner ve loading bar göster
    showLoadingBar();
    if (spinner) spinner.style.display = "inline-block";
    cityInput.disabled = true;

    if (localStorage.getItem("username")) {
      addToSearchHistory(city);
    }

    try {
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

      if (data.response && data.response.length > 0) {
        const encodedResponse = encodeURIComponent(data.response);
        window.location.href = `response.html?cevap=${encodedResponse}`;
      } else {
        const errorMessage = encodeURIComponent(`⚠️ Hata: ${data.error || "Yanıt alınamadı."}`);
        window.location.href = `response.html?cevap=${errorMessage}`;
      }

    } catch (error) {
      console.error("❌ İstek hatası:", error);
      const errorMessage = encodeURIComponent("🚨 Bir hata oluştu. Sunucuya erişilemedi.");
      window.location.href = `response.html?cevap=${errorMessage}`;
    } finally {
      // 🔄 Spinner ve loading bar gizle
      if (spinner) spinner.style.display = "none";
      cityInput.disabled = false;
      hideLoadingBar();
      isSearching = false;
    }
  };

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

  sorBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (city) {
      searchCity(city);
    } else {
      console.log("Şehir boş.");
    }
  });

  cityInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      const city = cityInput.value.trim();
      if (city) {
        searchCity(city);
      }
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const cityInput = document.getElementById("cityInput");
  const sorBtn = document.getElementById("sorBtn");
  const searchHistory = document.getElementById("searchHistory");
  const loadingBar = document.getElementById("loadingBar");
  const loadingProgress = document.querySelector(".loading-progress");

  if (!cityInput) console.error("cityInput bulunamadı!");
  if (!sorBtn) console.error("sorBtn bulunamadı!");
  if (!searchHistory) console.error("searchHistory bulunamadı!");
  if (!loadingBar) console.error("loadingBar bulunamadı!");

  let isSearching = false;

  const searchCity = async (city) => {
    if (isSearching) {
      console.warn("Zaten bir arama yapılıyor, tekrar başlatılmadı.");
      return;
    }

    isSearching = true;
    console.log("searchCity: Arama yapılıyor, şehir =", city);

    // Yükleme çubuğunu göster
    loadingBar.style.display = "block";
    loadingProgress.style.width = "0%"; // Başlangıçta sıfırla

    if (localStorage.getItem("username")) {
      addToSearchHistory(city);
    }

    try {
      // API çağrısı (Akış modu)
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: `${city} Şehri hakkında tarihi, siyasi, kültürel bilgiler ver ve gezilecek yerler öner.`,
          stream: true // Akış modunu etkinleştir
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP hatası: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = "";
      let receivedChunks = 0;
      const estimatedTotalChunks = 50; // Tahmini parça sayısı (model ve yanıt uzunluğuna göre ayarlanabilir)

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          console.log("🟢 Akış tamamlandı.");
          loadingProgress.style.width = "100%"; // Yükleme tamamlandı
          break;
        }

        // Gelen veri parçasını işle
        const chunk = decoder.decode(value, { stream: true });
        console.log("📡 Gelen parça:", chunk);
        fullResponse += chunk;

        // Yükleme çubuğunu güncelle (basit bir tahminle)
        receivedChunks++;
        const progress = Math.min((receivedChunks / estimatedTotalChunks) * 100, 90); // %90'a kadar ilerle
        loadingProgress.style.width = `${progress}%`;
      }

      // Yanıt tamamlandı, response.html'ye yönlendir
      if (fullResponse) {
        const encodedResponse = encodeURIComponent(fullResponse);
        window.location.href = `response.html?cevap=${encodedResponse}`;
      } else {
        const errorMessage = encodeURIComponent("⚠️ Hata: Yanıt alınamadı.");
        window.location.href = `response.html?cevap=${errorMessage}`;
      }

    } catch (error) {
      console.error("❌ İstek hatası:", error);
      const errorMessage = encodeURIComponent("🚨 Bir hata oluştu. Sunucuya erişilemedi.");
      window.location.href = `response.html?cevap=${errorMessage}`;
    } finally {
      isSearching = false;
      loadingBar.style.display = "none"; // Yükleme çubuğunu gizle
    }
  };

  // Arama geçmişine ekleme
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
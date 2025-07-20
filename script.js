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

 Stuart

// Yükleme çubuğu animasyonu
  const startLoadingAnimation = (duration = 5000) => {
    let progress = 0;
    loadingBar.style.display = "block";
    loadingProgress.style.width = "0%";

    const interval = setInterval(() => {
      progress += 2; // Her 100ms'de %2 ilerle
      loadingProgress.style.width = `${Math.min(progress, 90)}%`; // Maksimum %90
    }, duration / 50); // 5 saniyede %90'a ulaşacak şekilde

    return () => {
      clearInterval(interval);
      loadingProgress.style.width = "100%"; // Animasyonu tamamla
      setTimeout(() => {
        loadingBar.style.display = "none"; // 100ms gecikmeyle gizle
      }, 100);
    };
  };

  const searchCity = async (city) => {
    if (isSearching) {
      console.warn("Zaten bir arama yapılıyor, tekrar başlatılmadı.");
      return;
    }

    isSearching = true;
    console.log("searchCity: Arama yapılıyor, şehir =", city);

    // Yanıt gelmeden hemen önce animasyonu başlat
    const stopAnimation = startLoadingAnimation(5000); // 5 saniyelik tahmini süre

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
          message: `${city} Şehri hakkında tarihi, siyasi, kültürel bilgiler ver ve gezilecek yerler öner.`,
          stream: true // Akış modunu dene, desteklenmezse normal mod çalışır
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP hatası: ${response.status}`);
      }

      let fullResponse = "";
      if (response.headers.get("content-type").includes("text/event-stream")) {
        // Akış modu
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let receivedChunks = 0;
        const estimatedTotalChunks = 50; // Tahmini parça sayısı

        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            console.log("🟢 Akış tamamlandı.");
            stopAnimation(); // Animasyonu tamamla
            break;
          }

          const chunk = decoder.decode(value, { stream: true });
          console.log("📡 Gelen parça:", chunk);
          fullResponse += chunk;

          // Akış modunda da tahmini ilerleme (gerçek yüzde sağlanmıyor)
          receivedChunks++;
          const progress = Math.min((receivedChunks / estimatedTotalChunks) * 100, 90);
          loadingProgress.style.width = `${progress}%`;
        }
      } else {
        // Normal mod
        const data = await response.json();
        console.log("🟢 Sunucudan dönen veri:", data);
        fullResponse = data.response || "";
        stopAnimation(); // Animasyonu tamamla
      }

      // Yanıt tamamlandı, response.html'ye yönlendir
      if (fullResponse) {
        const encodedResponse = encodeURIComponent(fullResponse);
        window.location.href = `response.html?cevap=${encodedResponse}`;
      } else {
        const errorMessage = encodeURIComponent(`⚠️ Hata: ${data.error || "Yanıt alınamadı."}`);
        window.location.href = `response.html?cevap=${errorMessage}`;
      }

    } catch (error) {
      console.error("❌ İstek hatası:", error);
      stopAnimation(); // Hata durumunda animasyonu tamamla
      const errorMessage = encodeURIComponent("🚨 Bir hata oluştu. Sunucuya erişilemedi.");
      window.location.href = `response.html?cevap=${errorMessage}`;
    } finally {
      isSearching = false;
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
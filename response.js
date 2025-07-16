document.addEventListener("DOMContentLoaded", () => {
  // Arama geçmişini yükle ve göster
  const loadSearchHistory = () => {
    const historyList = document.getElementById('searchHistory');
    const searchHistory = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    historyList.innerHTML = '';
    searchHistory.forEach(city => {
      const li = document.createElement('li');
      li.textContent = city;
      // Arama geçmişine tıklama olayı ekle
      li.addEventListener('click', () => {
        const cityInput = document.getElementById('cityInput');
        const sorBtn = document.getElementById('sorBtn');
        cityInput.value = city; // Tıklanan şehri input'a yaz
        sorBtn.click(); // Arama butonunu programatik olarak tetikle
        document.getElementById('historyBox').classList.remove('active'); // Arama geçmişini kapat
        document.querySelector('.response-box').classList.remove('history-active'); // Cevap kutusunu sola geri getir
      });
      historyList.appendChild(li);
    });
  };

  // Arama geçmişine yeni şehir ekle
  const addToSearchHistory = (city) => {
    const searchHistory = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    if (!searchHistory.includes(city)) {
      searchHistory.unshift(city);
      if (searchHistory.length > 10) searchHistory.pop();
      localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    }
  };

  // Sayfa yüklendiğinde geçmişi göster
  loadSearchHistory();

  // Arama geçmişi butonuna olay dinleyicisi ekle
  const historyToggle = document.getElementById('historyToggle');
  const historyBox = document.getElementById('historyBox');
  const responseBox = document.querySelector('.response-box');
  historyToggle.addEventListener('click', () => {
    historyBox.classList.toggle('active');
    responseBox.classList.toggle('history-active'); // Response-box için sınıf ekle/kaldır
  });

  // Arama geçmişi kutusunu dışarıda tıklama ile kapatma
  document.addEventListener('click', (event) => {
    if (!historyBox.contains(event.target) && !historyToggle.contains(event.target)) {
      historyBox.classList.remove('active');
      responseBox.classList.remove('history-active'); // Response-box sınıfını kaldır
    }
  });

  // URL'den cevabı al ve göster
  const urlParams = new URLSearchParams(window.location.search);
  const cevap = urlParams.get('cevap');

  if (cevap) {
    document.getElementById('cevap').textContent = decodeURIComponent(cevap);
  } else {
    document.getElementById('cevap').textContent = 'Cevap bulunamadı. Lütfen tekrar deneyin.';
  }

  // Ana Sayfa butonuna olay dinleyicisi ekle
  document.getElementById('backToHome').addEventListener('click', () => {
    window.location.href = 'index.html';
  });

  // Arama çubuğu butonuna olay dinleyicisi ekle
  document.getElementById("sorBtn").addEventListener("click", async (event) => {
    event.preventDefault();
    const city = document.getElementById("cityInput").value.trim();
    
    if (city === '') {
      return;
    }

    addToSearchHistory(city);
    loadSearchHistory();

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: `${city} hakkında kısa tarihi ve kültürel bilgiler ver.`
        })
      });

      const data = await response.json();
      console.log("🟢 Sunucudan dönen veri:", data);

      if (data.reply) {
        const encodedResponse = encodeURIComponent(data.reply);
        window.location.href = `response.html?cevap=${encodedResponse}`;
      } else {
        const errorMessage = encodeURIComponent(`⚠️ Hata: ${data.error || "Yanıt alınamadı."}`);
        window.location.href = `response.html?cevap=${errorMessage}`;
      }
    } catch (error) {
      console.error("❌ İstek hatası:", error);
      const errorMessage = encodeURIComponent("🚨 Bir hata oluştu. Sunucuya erişilemedi.");
      window.location.href = `response.html?cevap=${errorMessage}`;
    }
  });
});
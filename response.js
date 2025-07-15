document.addEventListener("DOMContentLoaded", () => {
  // URL'den cevabı al ve göster
  const urlParams = new URLSearchParams(window.location.search);
  const cevap = urlParams.get('cevap');

  if (cevap) {
    document.getElementById('cevap').textContent = decodeURIComponent(cevap);
  } else {
    document.getElementById('cevap').textContent = 'Cevap bulunamadı. Lütfen tekrar deneyin.';
  }

  // Arama çubuğu için olay dinleyicisi
  document.getElementById('sorBtn').addEventListener('click', async (event) => {
    event.preventDefault(); // Formun varsayılan gönderimini engelle
    const city = document.getElementById('cityInput').value.trim();
    
    if (city === '') {
      alert('Lütfen bir şehir giriniz.');
      return;
    }

    try {
      // API çağrısı
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: `${city} hakkında kısa tarihi ve kültürel bilgiler ver.`
        })
      });

      const data = await response.json();
      console.log('🟢 Sunucudan dönen veri:', data);

      if (data.reply) {
        // Cevabı URL parametresi olarak kodla ve response.html'ye yönlendir
        const encodedResponse = encodeURIComponent(data.reply);
        window.location.href = `response.html?cevap=${encodedResponse}`;
      } else {
        // Hata durumunda response.html'ye hata mesajıyla yönlendir
        const errorMessage = encodeURIComponent(`⚠️ Hata: ${data.error || 'Yanıt alınamadı.'}`);
        window.location.href = `response.html?cevap=${errorMessage}`;
      }
    } catch (error) {
      console.error('❌ İstek hatası:', error);
      // Hata durumunda response.html'ye hata mesajıyla yönlendir
      const errorMessage = encodeURIComponent('🚨 Bir hata oluştu. Sunucuya erişilemedi.');
      window.location.href = `response.html?cevap=${errorMessage}`;
    }
  });
});
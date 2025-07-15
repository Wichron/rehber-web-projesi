document.addEventListener("DOMContentLoaded", () => {
  // Kayıt Ol butonuna olay dinleyicisi ekle
  document.getElementById("signupBtn").addEventListener("click", () => {
    window.location.href = "signup.html"; // Aynı sekmede signup.html'ye yönlendir
  });

  // Giriş Yap butonuna olay dinleyicisi ekle
  document.getElementById("loginBtn").addEventListener("click", () => {
    window.location.href = "login.html"; // Aynı sekmede login.html'ye yönlendir
  });

  // Arama çubuğu butonuna olay dinleyicisi ekle
  document.getElementById("sorBtn").addEventListener("click", async (event) => {
    event.preventDefault(); // Formun varsayılan gönderimini engelle
    const city = document.getElementById("cityInput").value.trim();
    
    if (city === '') {
      return;
    }

    try {
      // API çağrısı
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
        // Cevabı URL parametresi olarak kodla ve response.html'ye yönlendir
        const encodedResponse = encodeURIComponent(data.reply);
        window.location.href = `response.html?cevap=${encodedResponse}`;
      } else {
        // Hata durumunda response.html'ye hata mesajıyla yönlendir
        const errorMessage = encodeURIComponent(`⚠️ Hata: ${data.error || "Yanıt alınamadı."}`);
        window.location.href = `response.html?cevap=${errorMessage}`;
      }
    } catch (error) {
      console.error("❌ İstek hatası:", error);
      // Hata durumunda response.html'ye hata mesajıyla yönlendir
      const errorMessage = encodeURIComponent("🚨 Bir hata oluştu. Sunucuya erişilemedi.");
      window.location.href = `response.html?cevap=${errorMessage}`;
    }
  });
});
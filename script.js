document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("sorBtn").addEventListener("click", async (event) => {
    event.preventDefault();
    const city = document.getElementById("cityInput").value;
    const cevapAlani = document.getElementById("cevap");

    cevapAlani.textContent = "🧠 Yapay zeka düşünüyor...";

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: `Ankara hakkında kısa tarihi ve kültürel bilgiler ver.`
        })
      });

      const data = await response.json();
      console.log("🟢 Sunucudan dönen veri:", data);

      if (data.reply) {
        cevapAlani.textContent = data.reply;
      } else {
        cevapAlani.textContent = `⚠️ Hata: ${data.error || "Yanıt alınamadı."}`;
      }
    } catch (error) {
      console.error("❌ İstek hatası:", error);
      cevapAlani.textContent = "🚨 Bir hata oluştu. Sunucuya erişilemedi.";
    }
  });
});

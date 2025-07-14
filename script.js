document.getElementById("sorBtn").addEventListener("click", async (event) => {
  event.preventDefault(); // Sayfanın yenilenmesini engeller
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
        prompt: `${city} hakkında kısa tarihi ve kültürel bilgiler ver.`
      })
    });

    const data = await response.json();
    console.log("🟢 Sunucudan dönen veri:", data);

    if (!data.response) {
      cevapAlani.textContent = "⚠️ Yanıt alınamadı.";
    } else {
      cevapAlani.textContent = data.response;
    }

  } catch (error) {
    console.error("❌ İstek hatası:", error);
    cevapAlani.textContent = "🚨 Bir hata oluştu. Sunucuya erişilemedi.";
  }
});

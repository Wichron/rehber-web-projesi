document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("sorBtn").addEventListener("click", async function () {
    const city = document.getElementById("cityInput").value.trim();
    const cevapAlani = document.getElementById("cevap");

    if (!city) {
      cevapAlani.textContent = "Lütfen bir şehir adı girin.";
      return;
    }

    cevapAlani.textContent = "Yapay zeka düşünüyor...";

    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `${city} hakkında kısa tarihi ve kültürel bilgiler ver.`
        })
      });

      if (!response.ok) {
        throw new Error("Sunucu hatası: " + response.status);
      }

      const data = await response.json();

      if (data && data.response) {
        cevapAlani.textContent = data.response;
      } else {
        cevapAlani.textContent = "Yapay zekadan cevap alınamadı.";
      }
    } catch (error) {
      console.error("Hata:", error);
      cevapAlani.textContent = "Bir hata oluştu. Lütfen daha sonra tekrar deneyin.";
    }
  });
});

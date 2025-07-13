async function sor() {
  const city = document.getElementById("cityInput").value;
  const cevapAlani = document.getElementById("cevap");

  cevapAlani.textContent = "Yapay zeka düşünüyor...";

  const response = await fetch("/api/ask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt: `${city} hakkında kısa tarihi ve kültürel bilgiler ver.`
    })
  });

  const data = await response.json();
  cevapAlani.textContent = data.response;
}

async function sor() {
    const city = document.getElementById("cityInput").value;
    const cevapAlani = document.getElementById("cevap");
  
    cevapAlani.textContent = "Yükleniyor...";
  
    const response = await fetch("http://localhost:3000/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        prompt: `${city} hakkında kısa tarihi ve kültürel bilgiler ver.`,
        model: "mistral" // veya "llama3"
      })
    });
  
    const data = await response.json();
    cevapAlani.textContent = data.response;
  }
  
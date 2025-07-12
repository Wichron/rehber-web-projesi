function sor() {
  const city = document.getElementById("cityInput").value;
  const cevapElement = document.getElementById("cevap");

  cevapElement.style.display = "block";
  cevapElement.textContent = "Yükleniyor...";

  // Sahte gecikme ve sahte cevap
  setTimeout(() => {
    const cevap = `${city} hakkında bilgi: Bu şehir Türkiye'nin güzel şehirlerinden biridir.`;
    cevapElement.textContent = cevap;
  }, 1500);
}

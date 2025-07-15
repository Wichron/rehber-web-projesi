document.addEventListener("DOMContentLoaded", () => {
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
    window.location.href = 'index.html'; // Göreceli yol kullanımı
  });
});
document.addEventListener("DOMContentLoaded", () => {
  // Kayıt Ol butonuna olay dinleyicisi ekle
  const signupBtn = document.getElementById("signupBtn");
  if (signupBtn) {
    signupBtn.addEventListener("click", () => {
      window.location.href = "signup.html"; // Aynı sekmede signup.html'ye yönlendir
    });
  }

  // Ana Sayfa butonuna olay dinleyicisi ekle
  const backToHome = document.getElementById("backToHome");
  if (backToHome) {
    backToHome.addEventListener("click", () => {
      window.location.href = "index.html"; // Aynı sekmede index.html'ye yönlendir
    });
  }

  // Form gönderildiğinde
  const signupForm = document.getElementById("signupForm");
  if (signupForm) {
    signupForm.addEventListener("submit", (event) => {
      event.preventDefault(); // Varsayılan form gönderimini engelle
      const formData = new FormData(event.target);
      const userData = {
        username: formData.get("username"),
        password: formData.get("password"),
        email: formData.get("email"),
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName")
      };
      console.log("Kayıt Verileri:", userData); // Sunucuya gönderilecek veriler
      alert("Kayıt işlemi başarıyla gönderildi! (Bu bir demo, gerçek bir sunucuya gönderilmedi.)");
      // Gerçek bir uygulamada burada API çağrısı yapılır
      // Örnek: fetch("/api/signup", { method: "POST", body: JSON.stringify(userData) });
    });
  }
});
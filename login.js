document.addEventListener("DOMContentLoaded", () => {
  // Kayıt Ol butonuna olay dinleyicisi ekle
  const signupBtn = document.getElementById("signupBtn");
  if (signupBtn) {
    signupBtn.addEventListener("click", () => {
      window.location.href = "signup.html"; // Aynı sekmede signup.html'ye yönlendir
    });
  }

  // Giriş Yap butonuna olay dinleyicisi ekle
  const loginBtn = document.getElementById("loginBtn");
  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      window.location.href = "login.html"; // Aynı sekmede login.html'ye yönlendir
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
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", (event) => {
      event.preventDefault(); // Varsayılan form gönderimini engelle
      const formData = new FormData(event.target);
      const loginData = {
        usernameOrEmail: formData.get("usernameOrEmail"),
        password: formData.get("password")
      };
      console.log("Giriş Verileri:", loginData); // Sunucuya gönderilecek veriler
      alert("Giriş işlemi başarıyla gönderildi! (Bu bir demo, gerçek bir sunucuya gönderilmedi.)");
      // Gerçek bir uygulamada burada API çağrısı yapılır
      // Örnek: fetch("/api/login", { method: "POST", body: JSON.stringify(loginData) });
    });
  }
});
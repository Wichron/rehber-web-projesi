document.addEventListener("DOMContentLoaded", () => {
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
      // Gerçek bir uygulamada burada API çağrısı yapılır
      // Örnek: fetch("/api/login", { method: "POST", body: JSON.stringify(loginData) });
      
      // Örnek olarak: Giriş başarılıysa kullanıcı adını localStorage'a kaydet
      localStorage.setItem("username", loginData.usernameOrEmail);
      window.location.href = "index.html"; // Ana sayfaya yönlendir
    });
  }
});
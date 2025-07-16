document.addEventListener("DOMContentLoaded", () => {
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
      const password = formData.get("password");
      const confirmPassword = formData.get("confirmPassword");

      // Şifre ve şifre tekrar alanlarını karşılaştır
      if (password !== confirmPassword) {
        alert("Şifreler eşleşmiyor!");
        return; // Şifreler eşleşmiyorsa işlemi durdur
      }

      const userData = {
        username: formData.get("username"),
        password: password,
        email: formData.get("email"),
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName")
      };
      console.log("Kayıt Verileri:", userData); // Sunucuya gönderilecek veriler
      // Gerçek bir uygulamada burada API çağrısı yapılır
      // Örnek: fetch("/api/signup", { method: "POST", body: JSON.stringify(userData) });

      // Örnek olarak: Kayıt başarılıysa kullanıcı adını localStorage'a kaydet
      localStorage.setItem("username", userData.username);
      window.location.href = "index.html"; // Ana sayfaya yönlendir
    });
  }
});
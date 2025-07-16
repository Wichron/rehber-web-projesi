document.addEventListener("DOMContentLoaded", () => {
  const renderAuthButtons = () => {
    const authButtons = document.getElementById("authButtons");
    const username = localStorage.getItem("username");

    if (authButtons) {
      if (username) {
        // Kullanıcı giriş yapmışsa
        authButtons.innerHTML = `
          <div class="username-box">
            <span>${username}</span>
            <button class="logout-button">Çıkış Yap</button>
          </div>
        `;
        // Çıkış yap butonuna olay dinleyicisi
        const logoutButton = document.querySelector(".logout-button");
        logoutButton.addEventListener("click", () => {
          localStorage.removeItem("username");
          window.location.href = "index.html"; // Çıkış yaptıktan sonra ana sayfaya yönlendir
        });
      } else {
        // Kullanıcı giriş yapmamışsa
        authButtons.innerHTML = `
          <button class="auth-button signup-button" id="signupBtn">Kayıt Ol</button>
          <button class="auth-button" id="loginBtn">Giriş Yap</button>
        `;
        // Kayıt Ol butonuna olay dinleyicisi
        const signupBtn = document.getElementById("signupBtn");
        if (signupBtn) {
          signupBtn.addEventListener("click", () => {
            window.location.href = "signup.html";
          });
        }
        // Giriş Yap butonuna olay dinleyicisi
        const loginBtn = document.getElementById("loginBtn");
        if (loginBtn) {
          loginBtn.addEventListener("click", () => {
            window.location.href = "login.html";
          });
        }
      }
    }
  };

  // Sayfada authButtons render et
  renderAuthButtons();
});
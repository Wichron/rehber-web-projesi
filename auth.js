document.addEventListener("DOMContentLoaded", () => {
  const renderAuthButtons = () => {
    const authButtons = document.getElementById("authButtons");
    const username = localStorage.getItem("username");
    console.log("auth.js: username =", username); // Hata ayıklama

    if (authButtons) {
      if (username) {
        // Kullanıcı giriş yapmışsa
        authButtons.innerHTML = `
          <div class="username-box">
            <span>${username}</span>
            <div class="dropdown-menu" id="dropdownMenu">
              <div class="dropdown-item settings-item">Ayarlar</div>
              <div class="dropdown-item logout-button">Çıkış Yap</div>
            </div>
          </div>
        `;
        // Kullanıcı adı kutusuna olay dinleyicisi
        const usernameBox = document.querySelector(".username-box");
        const dropdownMenu = document.getElementById("dropdownMenu");
        if (usernameBox && dropdownMenu) {
          usernameBox.addEventListener("click", (event) => {
            event.stopPropagation();
            dropdownMenu.classList.toggle("active");
          });
        }

        // Ayarlar seçeneğine olay dinleyicisi
        const settingsItem = document.querySelector(".settings-item");
        if (settingsItem) {
          settingsItem.addEventListener("click", () => {
            window.location.href = "settings.html";
          });
        }

        // Çıkış yap butonuna olay dinleyicisi
        const logoutButton = document.querySelector(".logout-button");
        if (logoutButton) {
          logoutButton.addEventListener("click", () => {
            localStorage.removeItem("username");
            window.location.href = "index.html";
          });
        }

        // Menü dışına tıklayınca kapatma
        document.addEventListener("click", (event) => {
          if (!usernameBox.contains(event.target)) {
            dropdownMenu.classList.remove("active");
          }
        });

        // Arama geçmişi butonunu göster
        const buttonGroup = document.getElementById("buttonGroup");
        if (buttonGroup) {
          buttonGroup.innerHTML = `
            <button class="history-button" id="historyToggle">
              <img src="menu.png" alt="Arama Geçmişi">
            </button>
            <button class="home-button" id="backToHome">Ana Sayfa</button>
          `;
          // Arama geçmişi butonuna olay dinleyicisi
          const historyToggle = document.getElementById("historyToggle");
          const historyBox = document.getElementById("historyBox");
          if (historyToggle && historyBox) {
            historyToggle.addEventListener("click", () => {
              historyBox.classList.toggle("active");
              document.querySelector(".response-box").classList.toggle("history-active");
            });
          }
          // Ana sayfa butonuna olay dinleyicisi
          const backToHome = document.getElementById("backToHome");
          if (backToHome) {
            backToHome.addEventListener("click", () => {
              window.location.href = "index.html";
            });
          }
        }

        // Kullanıcıya özgü arama geçmişini yükle
        if (typeof window.loadSearchHistory === "function") {
          console.log("auth.js: loadSearchHistory çağrılıyor.");
          window.loadSearchHistory();
        } else {
          console.error("auth.js: loadSearchHistory fonksiyonu tanımlı değil!");
        }
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
        // Arama geçmişi butonunu ve kutusunu gizle
        const buttonGroup = document.getElementById("buttonGroup");
        if (buttonGroup) {
          buttonGroup.innerHTML = `
            <button class="home-button" id="backToHome">Ana Sayfa</button>
          `;
          // Ana sayfa butonuna olay dinleyicisi
          const backToHome = document.getElementById("backToHome");
          if (backToHome) {
            backToHome.addEventListener("click", () => {
              window.location.href = "index.html";
            });
          }
        }
        const historyBox = document.getElementById("historyBox");
        if (historyBox) {
          historyBox.style.display = "none";
        }
      }
    } else {
      console.error("auth.js: authButtons elemanı bulunamadı!");
    }
  };

  // Sayfada authButtons render et
  console.log("auth.js: renderAuthButtons çağrılıyor.");
  renderAuthButtons();
});
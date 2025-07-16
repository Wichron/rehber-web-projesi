document.addEventListener("DOMContentLoaded", () => {
  // Firebase ve gerekli modülleri içe aktar
  const { auth, db } = window.firebase; // CDN ile yüklendiğinde global erişim
  const { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } = window.firebase.auth;
  const { doc, setDoc } = window.firebase.firestore;

  // Kayıt Ol butonuna olay dinleyicisi ekle
  const signupBtn = document.getElementById("signupBtn");
  if (signupBtn) {
    signupBtn.addEventListener("click", () => {
      signupForm.dataset.mode = "signup"; // Modu kayıt olarak ayarla
      authSubmit.textContent = "Kaydol";
      document.querySelector(".header").textContent = "Kayıt Ol";
      signupForm.reset();
      document.getElementById("firstName").style.display = "block";
      document.getElementById("username").style.display = "block";
      document.getElementById("confirmPassword").style.display = "block";
    });
  }

  // Giriş Yap butonuna olay dinleyicisi ekle
  const loginBtn = document.getElementById("loginBtn");
  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      signupForm.dataset.mode = "login"; // Modu giriş olarak ayarla
      authSubmit.textContent = "Giriş Yap";
      document.querySelector(".header").textContent = "Giriş Yap";
      signupForm.reset();
      document.getElementById("firstName").style.display = "none";
      document.getElementById("username").style.display = "none";
      document.getElementById("confirmPassword").style.display = "none";
    });
  }

  // Ana Sayfa butonuna olay dinleyicisi ekle
  const backToHome = document.getElementById("backToHome");
  if (backToHome) {
    backToHome.addEventListener("click", () => {
      window.location.href = "index.html"; // Aynı sekmede index.html'ye yönlendir
    });
  }

  // Çıkış Yap butonuna olay dinleyicisi ekle
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      try {
        await signOut(auth);
        alert("Çıkış yapıldı.");
      } catch (error) {
        alert(`Hata: ${error.message}`);
      }
    });
  }

  // Kullanıcı durumunu izle
  onAuthStateChanged(auth, (user) => {
    if (user) {
      signupBtn.style.display = "none";
      loginBtn.style.display = "none";
      logoutBtn.style.display = "block";
    } else {
      signupBtn.style.display = "block";
      loginBtn.style.display = "block";
      logoutBtn.style.display = "none";
    }
  });

  // Form gönderildiğinde
  const signupForm = document.getElementById("signupForm");
  const authSubmit = document.getElementById("authSubmit");
  if (signupForm) {
    signupForm.addEventListener("submit", async (event) => {
      event.preventDefault(); // Varsayılan form gönderimini engelle

      const formData = new FormData(event.target);
      const password = formData.get("password");
      const confirmPassword = formData.get("confirmPassword");
      const mode = signupForm.dataset.mode || "signup"; // Varsayılan mod kayıt

      // Şifre ve şifre tekrar alanlarını karşılaştır
      if (mode === "signup" && password !== confirmPassword) {
        alert("Şifreler eşleşmiyor!");
        return;
      }

      const userData = {
        username: formData.get("username"),
        email: formData.get("email"),
        firstName: formData.get("firstName")
      };

      try {
        if (mode === "signup") {
          const userCredential = await createUserWithEmailAndPassword(auth, userData.email, password);
          await setDoc(doc(db, "users", userCredential.user.uid), {
            firstName: userData.firstName,
            username: userData.username,
            email: userData.email,
            createdAt: new Date()
          });
          alert("Kayıt başarılı! Ana sayfaya yönlendiriliyorsunuz.");
          window.location.href = "index.html";
        } else {
          await signInWithEmailAndPassword(auth, userData.email, password);
          alert("Giriş başarılı! Ana sayfaya yönlendiriliyorsunuz.");
          window.location.href = "index.html";
        }
      } catch (error) {
        alert(`Hata: ${error.message}`);
      }
    });
  }
});
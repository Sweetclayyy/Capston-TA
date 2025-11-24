export default class Login {

showToast(message, isError = false) {
  const existingToast = document.querySelector(".toast");
  if (existingToast) existingToast.remove();

  const overlay = document.createElement("div");
  overlay.className = "toast-overlay";

  const toast = document.createElement("div");
  toast.className = "toast";

  // === GANTI ICON SESUAI STATUS (ceklis / silang) ===
  const iconSVG = isError
    ? `
      <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
        <circle class="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
        <path class="checkmark-check" fill="none" d="M16 16 L36 36 M36 16 L16 36" />
      </svg>`
    : `
      <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
        <circle class="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
        <path class="checkmark-check" fill="none" d="M14 27l7 7 16-16" />
      </svg>`;

  toast.innerHTML = `
    <div class="checkmark-wrapper">
      ${iconSVG}
    </div>
    <span class="toast-text">${message}</span>
  `;

  document.body.appendChild(overlay);
  document.body.appendChild(toast);

  setTimeout(() => {
    overlay.classList.add("show");
    toast.classList.add("show");
  }, 50);

  setTimeout(() => {
    overlay.classList.remove("show");
    toast.classList.remove("show");
    setTimeout(() => {
      overlay.remove();
      toast.remove();
    }, 400);
  }, 2800);
}

  async render() {
    return `
      <section class="login-container fullpage">
        <div class="login-left">
          <div class="left-group">
            <h2>Hello, <br><span>Welcome!</span></h2>
            <p>Selamat datang di aplikasi pencatatan keuangan Bara Architect Entertainment!</p>
            <p id="login-info">Anda perlu login untuk melanjutkan</p>
            <button class="btn-outline">Login</button>
          </div>
        </div>

        <div class="login-right">
          <h2>Log In</h2>
          <form id="loginForm" novalidate>
            <div class="form-group">
              <label for="username">Username</label>
              <input type="text" id="username" name="username" placeholder="Masukkan username Anda" />
              <small class="error-msg"></small>
            </div>

            <div class="form-group">
              <label for="password">Password</label>
              <input type="password" id="password" name="password" placeholder="Masukkan password Anda" />
              <small class="error-msg"></small>
            </div>

            <button type="submit" class="btn-login">Login</button>
          </form>
        </div>
      </section>
    `;
  }

  async afterRender() {
    await this._injectContent();
    document.body.classList.add("login-active");

    const form = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    function validateInput(input, message) {
      const errorMsg = input.nextElementSibling;
      if (!input.value.trim()) {
        input.classList.add('error');
        errorMsg.textContent = message;
      } else {
        input.classList.remove('error');
        errorMsg.textContent = '';
      }
    }

    usernameInput.addEventListener('input', () =>
      validateInput(usernameInput, 'Username tidak boleh kosong, harap isi username Anda!')
    );

    passwordInput.addEventListener('input', () =>
      validateInput(passwordInput, 'Password tidak boleh kosong, harap isi password Anda!')
    );

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      validateInput(usernameInput, 'Username tidak boleh kosong, harap isi username Anda!');
      validateInput(passwordInput, 'Password tidak boleh kosong, harap isi password Anda!');

      const hasError = document.querySelectorAll('.error').length > 0;
      if (hasError) return;

      this.showToast("Sedang memproses login...");

      const loginData = {
        username: usernameInput.value.trim(),
        password: passwordInput.value.trim(),
      };

      try {
        const response = await fetch("http://localhost:5000/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(loginData),
        });

        const result = await response.json();

        if (!response.ok) {
         this.showToast("Username atau password salah!", true);

          return;
        }

        localStorage.setItem("token", result.token);
        this.showToast("Login berhasil!");

        setTimeout(() => {
          document.body.classList.remove("login-active");
          window.location.hash = "#/dashboard";
        }, 2000);

      } catch (err) {
        console.error("❌ Error saat login:", err);
        this.showToast("Terjadi kesalahan server!");
      }
    });

  }

  async _injectContent() {
    const container = document.querySelector("#main-content");
    if (!container) return console.error("❌ #main-content tidak ditemukan!");
    container.innerHTML = await this.render();
  }

  unmount() {
    document.body.classList.remove("login-active");
  }
}

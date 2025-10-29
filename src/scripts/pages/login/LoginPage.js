export default class Login {
  async render() {
    return `
      <section class="login-container">
        <div class="login-left">
        <div class="left-group">
          <h2>Hello, <br><span>Welcome!</span></h2>
          <p>Selamats datang di aplikasi pencatatan keuangan Bara Architect Entertainment!</p>
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


    form.addEventListener('submit', (e) => {
      e.preventDefault();
      validateInput(usernameInput, 'Username tidak boleh kosong, harap isi username Anda!');
      validateInput(passwordInput, 'Password tidak boleh kosong, harap isi password Anda!');

      const hasError = document.querySelectorAll('.error').length > 0;
      if (!hasError) {
        console.log('Form valid! Proses login di sini...');
      }
    });
  }
}

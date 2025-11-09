import '../../components/HeaderComponent.js';

export default class SewaForm {
  constructor() {
    this.currentStep = 1;
    this.formData = {
      penyewa: {
        nama: '',
        alamat: '',
        nomorTelepon: ''
      },
      barang: [],
      tanggal: {
        sewa: '',
        kembali: ''
      }
    };
  }

  async render() {
    return `
      <section class="container">
        <div class="sewa-form-wrapper">
          <div class="form-header">
            <h1>Formulir Sewa</h1>
            <div class="auth-actions">
              <button id="backToListBtn" class="logout-btn">← Kembali</button>
              <div class="user-icon">👤</div>
            </div>
          </div>

          <div class="form-card">
            <div class="progress-bar">
              <div class="step ${this.currentStep >= 1 ? 'active' : ''}">
                <span class="step-number">1</span>
                <span class="step-label">Biodata Penyewa</span>
              </div>
              <div class="step ${this.currentStep >= 2 ? 'active' : ''}">
                <span class="step-number">2</span>
                <span class="step-label">Barang Sewa</span>
              </div>
              <div class="step ${this.currentStep >= 3 ? 'active' : ''}">
                <span class="step-number">3</span>
                <span class="step-label">Rincian Sewa</span>
              </div>
            </div>

            <div class="form-step" id="step-1" style="${this.currentStep === 1 ? 'display: block;' : 'display: none;'}">
              <div class="form-group">
                <label for="nama">Nama Lengkap</label>
                <input type="text" id="nama" placeholder="Masukkan nama diri" value="${this.formData.penyewa.nama}" required>
                <small class="error-message">Harap isi nama lengkap Anda</small>
              </div>
              <div class="form-group">
                <label for="alamat">Alamat</label>
                <input type="text" id="alamat" placeholder="Masukkan alamat diri" value="${this.formData.penyewa.alamat}" required>
                <small class="error-message">Harap isi alamat Anda</small>
              </div>
              <div class="form-group">
                <label for="nomorTelepon">Nomor Telepon</label>
                <input type="tel" id="nomorTelepon" placeholder="Masukkan nomor telepon" value="${this.formData.penyewa.nomorTelepon}" required>
                <small class="error-message">Harap isi nomor telepon Anda</small>
              </div>
              <div class="form-navigation">
                <button class="btn btn-secondary" disabled>Back</button>
                <button class="btn btn-primary next-btn">Next</button>
              </div>
            </div>

            <div class="form-step" id="step-2" style="${this.currentStep === 2 ? 'display: block;' : 'display: none;'}">
              <div class="barang-list">
                ${[1, 2, 3].map((i) => `
                  <div class="barang-item">
                    <select class="barang-select" data-index="${i - 1}">
                      <option value="">Pilih Barang ${i}</option>
                      <option value="barang1">Set Meja 1</option>
                      <option value="barang2">Set Meja 2</option>
                      <option value="barang3">Set Meja 3</option>
                      <option value="barang4">Set Meja 4</option>
                    </select>
                    <div class="quantity-controls">
                      <button class="qty-btn minus">-</button>
                      <input type="number" class="qty-input" value="1" min="1" max="10">
                      <button class="qty-btn plus">+</button>
                    </div>
                  </div>
                `).join('')}
              </div>

              <div class="form-navigation">
                <button class="btn btn-secondary back-btn">Back</button>
                <button class="btn btn-primary next-btn">Next</button>
              </div>
            </div>

            <div class="form-step" id="step-3" style="${this.currentStep === 3 ? 'display: block;' : 'display: none;'}">
              <div class="date-section">
                <div class="date-input">
                  <label>Tanggal Sewa</label>
                  <input type="date" id="tanggalSewa" value="${this.formData.tanggal.sewa}" required>
                </div>
                <div class="date-input">
                  <label>Tanggal Kembali</label>
                  <input type="date" id="tanggalKembali" value="${this.formData.tanggal.kembali}" required>
                </div>
              </div>

              <div class="form-navigation">
                <button class="btn btn-secondary back-btn">Back</button>
                <button class="btn btn-primary submit-btn">Submit</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    await this._injectContent();
    this._bindEvents();
    this.updateProgressIndicator();
  }

  async _injectContent() {
    const container = document.querySelector("#main-content");
    if (!container) return console.error("❌ #main-content tidak ditemukan!");
    container.innerHTML = await this.render();
  }

  _bindEvents() {
    document.getElementById("backToListBtn")?.addEventListener("click", () => {
      window.location.hash = "#/sewa";
    });

    document.querySelector('.next-btn')?.addEventListener('click', () => {
      if (this.validateStep1()) {
        this.currentStep = 2;
        this.afterRender();
      }
    });

    document.querySelectorAll('.next-btn')[1]?.addEventListener('click', () => {
      this.currentStep = 3;
      this.afterRender();
    });

    document.querySelector('.back-btn')?.addEventListener('click', () => {
      this.currentStep = 1;
      this.afterRender();
    });

    document.querySelectorAll('.back-btn')[1]?.addEventListener('click', () => {
      this.currentStep = 2;
      this.afterRender();
    });

    document.querySelector('.submit-btn')?.addEventListener('click', () => {
      this.submitForm();
    });

    ['nama', 'alamat', 'nomorTelepon'].forEach(id => {
      document.getElementById(id)?.addEventListener('input', (e) => {
        this.formData.penyewa[id] = e.target.value;
        this.validateInput(e.target);
      });
    });

    document.getElementById('tanggalSewa')?.addEventListener('change', (e) => {
      this.formData.tanggal.sewa = e.target.value;
    });

    document.getElementById('tanggalKembali')?.addEventListener('change', (e) => {
      this.formData.tanggal.kembali = e.target.value;
    });

    document.querySelectorAll('.qty-btn.minus').forEach(btn => {
      btn.addEventListener('click', () => {
        const input = btn.nextElementSibling;
        if (parseInt(input.value) > 1) input.value--;
      });
    });

    document.querySelectorAll('.qty-btn.plus').forEach(btn => {
      btn.addEventListener('click', () => {
        const input = btn.previousElementSibling;
        if (parseInt(input.value) < 10) input.value++;
      });
    });

    document.querySelectorAll('.barang-select').forEach(select => {
      select.addEventListener('change', (e) => {
        const index = parseInt(e.target.dataset.index);
        const selectedValue = e.target.value;
        const qty = e.target.parentNode.querySelector('.qty-input').value;
        this.formData.barang[index] = { nama: selectedValue, jumlah: qty };
      });
    });
  }

  validateStep1() {
    const nama = document.getElementById('nama');
    const alamat = document.getElementById('alamat');
    const nomorTelepon = document.getElementById('nomorTelepon');

    let isValid = true;
    [nama, alamat, nomorTelepon].forEach((input) => {
      if (!input.value.trim()) {
        this.showError(input, `Harap isi ${input.placeholder.replace('Masukkan ', '')}`);
        isValid = false;
      } else this.clearError(input);
    });
    return isValid;
  }

  validateInput(inputElement) {
    if (inputElement.value.trim()) this.clearError(inputElement);
    else this.showError(inputElement, `Harap isi ${inputElement.placeholder.replace('Masukkan ', '')}`);
  }

  showError(inputElement, message) {
    const error = inputElement.nextElementSibling;
    if (error) {
      error.textContent = message;
      error.style.display = 'block';
      inputElement.style.borderColor = '#ff6b6b';
    }
  }

  clearError(inputElement) {
    const error = inputElement.nextElementSibling;
    if (error) {
      error.style.display = 'none';
      inputElement.style.borderColor = '#ccc';
    }
  }

  updateProgressIndicator() {
    document.querySelectorAll('.step').forEach((step, index) => {
      step.classList.toggle('active', index + 1 <= this.currentStep);
    });
  }

  submitForm() {
    console.log('Form Data:', this.formData);
    alert('Form berhasil disubmit! Terima kasih telah menyewa.');
    window.location.hash = "#/sewa";
  }
}

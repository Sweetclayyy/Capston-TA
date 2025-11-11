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
      barang: Array(3).fill(null).map(() => ({ nama: '', jumlah: 1, includeModel: false })),
      tanggal: {
        sewa: '',
        kembali: ''
      }
    };
    this._boundMethods = {};
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

            <!-- Step 1 -->
            <div class="form-step" data-step="1" style="${this.currentStep === 1 ? 'display: block;' : 'display: none;'}">
              <div class="form-group">
                <label for="nama">Nama Lengkap</label>
                <input type="text" id="nama" placeholder="Masukkan Nama" value="${this.formData.penyewa.nama}" required>
                <small class="error-message">Harap isi nama lengkap Anda</small>
              </div>
              <div class="form-group">
                <label for="alamat">Alamat</label>
                <input type="text" id="alamat" placeholder="Masukkan alamat" value="${this.formData.penyewa.alamat}" required>
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

            <!-- Step 2 -->
            <div class="form-step" data-step="2" style="${this.currentStep === 2 ? 'display: block;' : 'display: none;'}">
              <div class="barang-list">
                ${[1, 2, 3].map((i) => {
                  const idx = i - 1;
                  const item = this.formData.barang[idx] || { nama: '', jumlah: 1, includeModel: false };
                  return `
                    <div class="barang-item">
                      <select class="barang-select" data-index="${idx}">
                        <option value="">Pilih Barang ${i}</option>
                        <option value="barang1"${item.nama === 'barang1' ? ' selected' : ''}>Set Kebaya 1</option>
                        <option value="barang2"${item.nama === 'barang2' ? ' selected' : ''}>Set Kebaya 2</option>
                        <option value="barang3"${item.nama === 'barang3' ? ' selected' : ''}>Set Kebaya 3</option>
                        <option value="barang4"${item.nama === 'barang4' ? ' selected' : ''}>Set Kebaya 4</option>
                      </select>

                      <div class="quantity-controls">
                        <button class="qty-btn minus" data-index="${idx}">-</button>
                        <input type="number" class="qty-input" value="${item.jumlah}" min="1" max="10" data-index="${idx}">
                        <button class="qty-btn plus" data-index="${idx}">+</button>
                      </div>

                      <div class="include-model">
                        <label>
                          <input type="checkbox" class="include-model-checkbox" data-index="${idx}" ${item.includeModel ? 'checked' : ''}>
                          Include Model
                        </label>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
              <div class="form-navigation">
                <button class="btn btn-secondary back-btn">Back</button>
                <button class="btn btn-primary next-btn">Next</button>
              </div>
            </div>

            <!-- Step 3 -->
            <div class="form-step" data-step="3" style="${this.currentStep === 3 ? 'display: block;' : 'display: none;'}">
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
    const container = document.querySelector("#main-content");
    if (!container) {
      console.error("❌ #main-content tidak ditemukan!");
      return;
    }
    container.innerHTML = await this.render();
    this._bindEvents();
    this._updateStepVisibility();
  }

  _bindEvents() {
    // Clear previous bound handlers to avoid duplication
    this._unbindEvents();

    const handlers = {
      backToList: () => { window.location.hash = "#/sewa"; },

      nextStep1: () => {
        if (this.validateStep1()) {
          this.currentStep = 2;
          this._updateStepVisibility();
        }
      },

      nextStep2: () => {
        this.currentStep = 3;
        this._updateStepVisibility();
      },

      backStep2: () => {
        this.currentStep = 1;
        this._updateStepVisibility();
      },

      backStep3: () => {
        this.currentStep = 2;
        this._updateStepVisibility();
      },

      submit: () => {
        if (this.validateStep3()) {
          this.submitForm();
        }
      },

      inputChange: (e) => {
        const field = e.target.id;
        if (field in this.formData.penyewa) {
          this.formData.penyewa[field] = e.target.value;
          this.validateInput(e.target);
        }
      },

      dateChange: (e) => {
        this.formData.tanggal[e.target.id.replace('tanggal', '').toLowerCase()] = e.target.value;
      },

      qtyChange: (e) => {
        const idx = parseInt(e.target.dataset.index);
        const type = e.target.classList.contains('minus') ? 'minus' : 'plus';
        const input = document.querySelector(`.qty-input[data-index="${idx}"]`);
        let val = parseInt(input.value);
        if (type === 'minus' && val > 1) val--;
        if (type === 'plus' && val < 10) val++;
        input.value = val;
        this.formData.barang[idx].jumlah = val;
      },

      barangSelect: (e) => {
        const idx = parseInt(e.target.dataset.index);
        this.formData.barang[idx].nama = e.target.value;
      },

      modelCheckbox: (e) => {
        const idx = parseInt(e.target.dataset.index);
        this.formData.barang[idx].includeModel = e.target.checked;
      }
    };

    // Bind new handlers
    document.getElementById("backToListBtn")?.addEventListener("click", handlers.backToList);
    document.querySelectorAll('.next-btn')[0]?.addEventListener('click', handlers.nextStep1);
    document.querySelectorAll('.next-btn')[1]?.addEventListener('click', handlers.nextStep2);
    document.querySelectorAll('.back-btn')[0]?.addEventListener('click', handlers.backStep2);
    document.querySelectorAll('.back-btn')[1]?.addEventListener('click', handlers.backStep3);
    document.querySelector('.submit-btn')?.addEventListener('click', handlers.submit);

    ['nama', 'alamat', 'nomorTelepon'].forEach(id => {
      document.getElementById(id)?.addEventListener('input', handlers.inputChange);
    });

    ['tanggalSewa', 'tanggalKembali'].forEach(id => {
      document.getElementById(id)?.addEventListener('change', handlers.dateChange);
    });

    document.querySelectorAll('.qty-btn').forEach(btn => {
      btn.addEventListener('click', handlers.qtyChange);
    });

    document.querySelectorAll('.barang-select').forEach(sel => {
      sel.addEventListener('change', handlers.barangSelect);
    });

    document.querySelectorAll('.include-model-checkbox').forEach(cb => {
      cb.addEventListener('change', handlers.modelCheckbox);
    });

    this._boundMethods = handlers;
  }

  _unbindEvents() {
    // Optional: implement cleanup if needed
  }

  _updateStepVisibility() {
    document.querySelectorAll('.form-step').forEach(step => {
      const stepNum = parseInt(step.dataset.step);
      step.style.display = stepNum === this.currentStep ? 'block' : 'none';
    });
    this._updateProgress();
  }

  _updateProgress() {
    document.querySelectorAll('.step').forEach((step, index) => {
      step.classList.toggle('active', index + 1 <= this.currentStep);
    });
  }

  validateStep1() {
    const fields = ['nama', 'alamat', 'nomorTelepon'];
    let isValid = true;
    fields.forEach(id => {
      const el = document.getElementById(id);
      if (!el?.value.trim()) {
        this.showError(el, `Harap isi ${el.placeholder.replace('Masukkan ', '')}`);
        isValid = false;
      } else {
        this.clearError(el);
      }
    });
    return isValid;
  }

  validateStep3() {
    const sewa = this.formData.tanggal.sewa;
    const kembali = this.formData.tanggal.kembali;
    if (!sewa || !kembali) {
      alert('Harap isi kedua tanggal!');
      return false;
    }
    if (new Date(kembali) < new Date(sewa)) {
      alert('Tanggal kembali tidak boleh sebelum tanggal sewa!');
      return false;
    }
    return true;
  }

  validateInput(inputElement) {
    if (inputElement.value.trim()) {
      this.clearError(inputElement);
    } else {
      this.showError(inputElement, `Harap isi ${inputElement.placeholder.replace('Masukkan ', '')}`);
    }
  }

  showError(inputElement, message) {
    const error = inputElement.nextElementSibling;
    if (error && error.classList.contains('error-message')) {
      error.textContent = message;
      error.style.display = 'block';
      inputElement.style.borderColor = '#ff6b6b';
    }
  }

  clearError(inputElement) {
    const error = inputElement.nextElementSibling;
    if (error && error.classList.contains('error-message')) {
      error.style.display = 'none';
      inputElement.style.borderColor = '#ccc';
    }
  }

  submitForm() {
    console.log('Form Data:', this.formData);
    alert('Form berhasil disubmit! Terima kasih telah menyewa.');
    window.location.hash = "#/sewa";
  }
}
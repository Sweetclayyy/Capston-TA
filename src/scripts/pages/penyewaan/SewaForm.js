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
            <h1>Sewa</h1>
            <div class="auth-actions">
              <button class="logout-btn">← Logout</button>
              <div class="user-icon">👤</div>
            </div>
          </div>

          <div class="form-card">
            <h2>Formulir Sewa</h2>
            
            <!-- Progress Bar -->
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

            <!-- Step 1: Biodata Penyewa -->
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

            <!-- Step 2: Barang Sewa -->
            <div class="form-step" id="step-2" style="${this.currentStep === 2 ? 'display: block;' : 'display: none;'}">
              <div class="barang-list">
                <div class="barang-item">
                  <select class="barang-select" data-index="0">
                    <option value="">Pilih Barang 1</option>
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
                <div class="barang-item">
                  <select class="barang-select" data-index="1">
                    <option value="">Pilih Barang 2</option>
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
                <div class="barang-item">
                  <select class="barang-select" data-index="2">
                    <option value="">Pilih Barang 3</option>
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
              </div>

              <div class="form-navigation">
                <button class="btn btn-secondary back-btn">Back</button>
                <button class="btn btn-primary next-btn">Next</button>
              </div>
            </div>

            <!-- Step 3: Rincian Sewa -->
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
    this.initializeEventListeners();
    this.updateProgressIndicator();
  }

  initializeEventListeners() {
    // Next button (Step 1 to Step 2)
    document.querySelector('.next-btn')?.addEventListener('click', () => {
      if (this.validateStep1()) {
        this.currentStep = 2;
        this.render().then(() => this.afterRender());
      }
    });

    // Back button (Step 2 to Step 1)
    document.querySelector('.back-btn')?.addEventListener('click', () => {
      this.currentStep = 1;
      this.render().then(() => this.afterRender());
    });

    // Next button (Step 2 to Step 3)
    document.querySelectorAll('.next-btn')[1]?.addEventListener('click', () => {
      this.currentStep = 3;
      this.render().then(() => this.afterRender());
    });

    // Back button (Step 3 to Step 2)
    document.querySelectorAll('.back-btn')[1]?.addEventListener('click', () => {
      this.currentStep = 2;
      this.render().then(() => this.afterRender());
    });

    // Submit button (Step 3)
    document.querySelector('.submit-btn')?.addEventListener('click', () => {
      this.submitForm();
    });

    // Handle input changes for real-time validation
    document.getElementById('nama')?.addEventListener('input', (e) => {
      this.formData.penyewa.nama = e.target.value;
      this.validateInput(e.target);
    });

    document.getElementById('alamat')?.addEventListener('input', (e) => {
      this.formData.penyewa.alamat = e.target.value;
      this.validateInput(e.target);
    });

    document.getElementById('nomorTelepon')?.addEventListener('input', (e) => {
      this.formData.penyewa.nomorTelepon = e.target.value;
      this.validateInput(e.target);
    });

    document.getElementById('tanggalSewa')?.addEventListener('change', (e) => {
      this.formData.tanggal.sewa = e.target.value;
    });

    document.getElementById('tanggalKembali')?.addEventListener('change', (e) => {
      this.formData.tanggal.kembali = e.target.value;
    });

    // Quantity controls
    document.querySelectorAll('.qty-btn.minus').forEach(btn => {
      btn.addEventListener('click', () => {
        const input = btn.nextElementSibling;
        let value = parseInt(input.value);
        if (value > 1) {
          input.value = value - 1;
        }
      });
    });

    document.querySelectorAll('.qty-btn.plus').forEach(btn => {
      btn.addEventListener('click', () => {
        const input = btn.previousElementSibling;
        let value = parseInt(input.value);
        if (value < 10) {
          input.value = value + 1;
        }
      });
    });

    // Barang select change
    document.querySelectorAll('.barang-select').forEach(select => {
      select.addEventListener('change', (e) => {
        const index = parseInt(e.target.dataset.index);
        const selectedValue = e.target.value;
        if (!this.formData.barang[index]) {
          this.formData.barang[index] = {};
        }
        this.formData.barang[index].nama = selectedValue;
        this.formData.barang[index].jumlah = parseInt(e.target.parentNode.querySelector('.qty-input').value);
      });
    });
  }

  validateStep1() {
    const nama = document.getElementById('nama');
    const alamat = document.getElementById('alamat');
    const nomorTelepon = document.getElementById('nomorTelepon');

    let isValid = true;

    if (!nama.value.trim()) {
      this.showError(nama, 'Harap isi nama lengkap Anda');
      isValid = false;
    } else {
      this.clearError(nama);
    }

    if (!alamat.value.trim()) {
      this.showError(alamat, 'Harap isi alamat Anda');
      isValid = false;
    } else {
      this.clearError(alamat);
    }

    if (!nomorTelepon.value.trim()) {
      this.showError(nomorTelepon, 'Harap isi nomor telepon Anda');
      isValid = false;
    } else {
      this.clearError(nomorTelepon);
    }

    return isValid;
  }

  validateInput(inputElement) {
    if (inputElement.value.trim()) {
      this.clearError(inputElement);
    } else {
      this.showError(inputElement, inputElement.placeholder.replace('Masukkan ', 'Harap isi ') || 'Field ini wajib diisi');
    }
  }

  showError(inputElement, message) {
    const errorElement = inputElement.nextElementSibling;
    if (errorElement && errorElement.classList.contains('error-message')) {
      errorElement.textContent = message;
      errorElement.style.display = 'block';
      inputElement.style.borderColor = '#ff6b6b';
    }
  }

  clearError(inputElement) {
    const errorElement = inputElement.nextElementSibling;
    if (errorElement && errorElement.classList.contains('error-message')) {
      errorElement.style.display = 'none';
      inputElement.style.borderColor = '#ccc';
    }
  }

  updateProgressIndicator() {
    const steps = document.querySelectorAll('.step');
    steps.forEach((step, index) => {
      if (index + 1 <= this.currentStep) {
        step.classList.add('active');
      } else {
        step.classList.remove('active');
      }
    });
  }

  submitForm() {
    // Simulate form submission
    console.log('Form Data:', this.formData);
    
    // In a real app, you would send this data to your backend
    alert('Form berhasil disubmit! Terima kasih telah menyewa.');
    
    // Optionally reset form or redirect
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
    this.render().then(() => this.afterRender());
  }
}
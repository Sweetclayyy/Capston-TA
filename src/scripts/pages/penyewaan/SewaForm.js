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
      barang: [{ nama: '', jumlah: 1, includeModel: false }],
      tanggal: {
        sewa: '',
        kembali: ''
      }
    };
    this.availableItems = [
      { id: 'kebaya1', name: 'Set Kebaya 1', price: 150000 },
      { id: 'kebaya2', name: 'Set Kebaya 2', price: 200000 },
      { id: 'kebaya3', name: 'Set Kebaya 3', price: 180000 },
      { id: 'kebaya4', name: 'Set Kebaya 4', price: 220000 },
    ];
  }

  async render() {
    return `
      <section class="container">
        <div class="sewa-form-wrapper">
          <div class="form-card">
            <h2 class="form-title">Formulir Sewa</h2>
            
            <div class="progress-bar">
              <div class="step ${this.currentStep >= 1 ? 'active' : ''} ${this.currentStep > 1 ? 'completed' : ''}">
                <span class="step-number">1</span>
                <span class="step-label">Biodata Penyewa</span>
              </div>
              <div class="progress-line ${this.currentStep >= 2 ? 'active' : ''}"></div>
              <div class="step ${this.currentStep >= 2 ? 'active' : ''} ${this.currentStep > 2 ? 'completed' : ''}">
                <span class="step-number">2</span>
                <span class="step-label">Barang Sewa</span>
              </div>
              <div class="progress-line ${this.currentStep >= 3 ? 'active' : ''}"></div>
              <div class="step ${this.currentStep >= 3 ? 'active' : ''}">
                <span class="step-number">3</span>
                <span class="step-label">Rincian Sewa</span>
              </div>
            </div>

            <!-- Step 1: Biodata Penyewa -->
            <div class="form-step ${this.currentStep === 1 ? 'active' : ''}">
              <div class="form-group">
                <label for="nama">Nama Lengkap</label>
                <input type="text" id="nama" placeholder="Masukkan nama anda" value="${this.formData.penyewa.nama}">
                <small class="error-message">Nama lengkap harus diisi</small>
              </div>
              <div class="form-group">
                <label for="alamat">Alamat</label>
                <input type="text" id="alamat" placeholder="Masukkan alamat rikkan" value="${this.formData.penyewa.alamat}">
                <small class="error-message">Alamat harus diisi</small>
              </div>
              <div class="form-group">
                <label for="nomorTelepon">Nomor Telepon</label>
                <input type="tel" id="nomorTelepon" placeholder="Masukkan nomor telepon" value="${this.formData.penyewa.nomorTelepon}">
                <small class="error-message">Nomor telepon harus diisi</small>
              </div>
              <div class="form-navigation">
                <button class="btn btn-link" disabled>Back</button>
                <button class="btn btn-primary next-btn">Next</button>
              </div>
            </div>

            <!-- Step 2: Barang Sewa -->
            <div class="form-step ${this.currentStep === 2 ? 'active' : ''}">
              <div class="barang-list" id="barangList">
                ${this.formData.barang.map((item, idx) => this.renderBarangItem(item, idx)).join('')}
              </div>
              
              <button class="btn btn-add-item" id="addItemBtn">
                <span>+</span> Tambah Barang
              </button>

              <div class="form-navigation">
                <button class="btn btn-link back-btn">Back</button>
                <button class="btn btn-primary next-btn">Next</button>
              </div>
            </div>

            <!-- Step 3: Rincian Sewa -->
            <div class="form-step ${this.currentStep === 3 ? 'active' : ''}">
              <div class="date-section">
                <div class="date-input">
                  <label>📅 Tanggal Sewa</label>
                  <input type="date" id="tanggalSewa" value="${this.formData.tanggal.sewa}">
                </div>
                <div class="date-input">
                  <label>📅 Tanggal Kembali</label>
                  <input type="date" id="tanggalKembali" value="${this.formData.tanggal.kembali}">
                </div>
              </div>
              <div class="form-navigation">
                <button class="btn btn-link back-btn">Back</button>
                <button class="btn btn-primary submit-btn">Submit</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  renderBarangItem(item, idx) {
    return `
      <div class="barang-item" data-index="${idx}">
        <div class="barang-header">
          <label>Nama Barang ${idx + 1}</label>
          ${this.formData.barang.length > 1 ? `<button class="btn-remove" data-index="${idx}">✕</button>` : ''}
        </div>
        <select class="barang-select" data-index="${idx}">
          <option value="">Pilih Barang ${idx + 1}</option>
          ${this.availableItems.map(availItem => `
            <option value="${availItem.id}" ${item.nama === availItem.id ? 'selected' : ''}>
              ${availItem.name}
            </option>
          `).join('')}
        </select>

        <div class="barang-controls">
          <div class="quantity-group">
            <label>Jumlah</label>
            <div class="quantity-controls">
              <button class="qty-btn minus" data-index="${idx}">−</button>
              <span class="qty-display">${item.jumlah}</span>
              <button class="qty-btn plus" data-index="${idx}">+</button>
            </div>
          </div>

          <div class="model-group">
            <label class="checkbox-label">
              <input type="checkbox" class="include-model-checkbox" data-index="${idx}" ${item.includeModel ? 'checked' : ''}>
              <span>Include Model</span>
            </label>
          </div>
        </div>
      </div>
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
  }

  _bindEvents() {
    // Navigation
    document.querySelectorAll('.next-btn')[0]?.addEventListener('click', () => {
      if (this.validateStep1()) {
        this.currentStep = 2;
        this.afterRender();
      }
    });

    document.querySelectorAll('.next-btn')[1]?.addEventListener('click', () => {
      if (this.validateStep2()) {
        this.currentStep = 3;
        this.afterRender();
      }
    });

    document.querySelectorAll('.back-btn').forEach((btn, idx) => {
      btn.addEventListener('click', () => {
        this.currentStep = idx === 0 ? 1 : 2;
        this.afterRender();
      });
    });

    document.querySelector('.submit-btn')?.addEventListener('click', () => {
      if (this.validateStep3()) {
        this.submitForm();
      }
    });

    // Step 1 inputs
    ['nama', 'alamat', 'nomorTelepon'].forEach(id => {
      document.getElementById(id)?.addEventListener('input', (e) => {
        this.formData.penyewa[id] = e.target.value;
        this.validateInput(e.target);
      });
    });

    // Step 2 - Barang controls
    document.querySelectorAll('.barang-select').forEach(sel => {
      sel.addEventListener('change', (e) => {
        const idx = parseInt(e.target.dataset.index);
        this.formData.barang[idx].nama = e.target.value;
      });
    });

    document.querySelectorAll('.qty-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.target.dataset.index);
        let val = this.formData.barang[idx].jumlah;
        
        if (e.target.classList.contains('minus') && val > 1) {
          val--;
        } else if (e.target.classList.contains('plus') && val < 10) {
          val++;
        }
        
        this.formData.barang[idx].jumlah = val;
        
        // Update display
        const display = document.querySelector(`.barang-item[data-index="${idx}"] .qty-display`);
        if (display) display.textContent = val;
      });
    });

    document.querySelectorAll('.include-model-checkbox').forEach(cb => {
      cb.addEventListener('change', (e) => {
        const idx = parseInt(e.target.dataset.index);
        this.formData.barang[idx].includeModel = e.target.checked;
      });
    });

    // Add item button
    document.getElementById('addItemBtn')?.addEventListener('click', () => {
      this.formData.barang.push({ nama: '', jumlah: 1, includeModel: false });
      this.afterRender();
    });

    // Remove item buttons
    document.querySelectorAll('.btn-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.target.dataset.index);
        this.formData.barang.splice(idx, 1);
        this.afterRender();
      });
    });

    // Step 3 - Date inputs
    ['tanggalSewa', 'tanggalKembali'].forEach(id => {
      document.getElementById(id)?.addEventListener('change', (e) => {
        const field = id.replace('tanggal', '').toLowerCase();
        this.formData.tanggal[field] = e.target.value;
      });
    });
  }

  validateStep1() {
    const fields = ['nama', 'alamat', 'nomorTelepon'];
    let isValid = true;
    
    fields.forEach(id => {
      const el = document.getElementById(id);
      if (!el?.value.trim()) {
        this.showError(el);
        isValid = false;
      } else {
        this.clearError(el);
      }
    });
    
    return isValid;
  }

  validateStep2() {
    const hasSelectedItem = this.formData.barang.some(item => item.nama !== '');
    if (!hasSelectedItem) {
      alert('Harap pilih minimal 1 barang!');
      return false;
    }
    return true;
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
      this.showError(inputElement);
    }
  }

  showError(inputElement) {
    const error = inputElement.nextElementSibling;
    if (error && error.classList.contains('error-message')) {
      error.style.display = 'block';
      inputElement.classList.add('error');
    }
  }

  clearError(inputElement) {
    const error = inputElement.nextElementSibling;
    if (error && error.classList.contains('error-message')) {
      error.style.display = 'none';
      inputElement.classList.remove('error');
    }
  }

  submitForm() {
    console.log('Form Data:', this.formData);
    alert('Form berhasil disubmit! Terima kasih telah menyewa.');
    window.location.hash = "#/sewa";
  }
}
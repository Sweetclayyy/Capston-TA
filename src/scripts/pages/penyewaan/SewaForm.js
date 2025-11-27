import '../../components/HeaderComponent.js';
import SewaFormPresenter from './SewaForm-Presenter.js';

export default class SewaForm {
constructor() {
  this.presenter = new SewaFormPresenter(this);
}


  async render() {
    return `
      <section class="container">
        <div class="sewa-form-wrapper">
          <div class="form-card">
            <div class="form-header">
              <img src="/logo/formm.png" alt="Form Icon" class="icon-form" />
              <h2 class="form-title">Formulir Sewa</h2>
            </div>

            <div class="progress-bar">
              <div class="step ${this.presenter.currentStep >= 1 ? 'active' : ''} ${this.presenter.currentStep > 1 ? 'completed' : ''}">
                <span class="step-number">1</span>
                <span class="step-label">Biodata Penyewa</span>
              </div>
              <div class="progress-line ${this.presenter.currentStep >= 2 ? 'active' : ''}"></div>
              <div class="step ${this.presenter.currentStep >= 2 ? 'active' : ''} ${this.presenter.currentStep > 2 ? 'completed' : ''}">
                <span class="step-number">2</span>
                <span class="step-label">Barang Sewa</span>
              </div>
              <div class="progress-line ${this.presenter.currentStep >= 3 ? 'active' : ''}"></div>
              <div class="step ${this.presenter.currentStep >= 3 ? 'active' : ''}">
                <span class="step-number">3</span>
                <span class="step-label">Rincian Sewa</span>
              </div>
            </div>

            <div class="form-step ${this.presenter.currentStep === 1 ? 'active' : ''}">
              <div class="form-group">
                <label for="nama">Nama Lengkap</label>
                <input type="text" id="nama" value="${this.presenter.formData.penyewa.nama}">
                <small class="error-message">Nama lengkap harus diisi</small>
              </div>

              <div class="form-group">
                <label for="alamat">Alamat</label>
                <input type="text" id="alamat" value="${this.presenter.formData.penyewa.alamat}">
                <small class="error-message">Alamat harus diisi</small>
              </div>

              <div class="form-group">
                <label for="nomorTelepon">Nomor Telepon</label>
                <input type="tel" id="nomorTelepon" value="${this.presenter.formData.penyewa.nomorTelepon}">
                <small class="error-message">Nomor telepon harus diisi</small>
              </div>

              <div class="form-navigation">
                <button class="btn btn-link" disabled>Back</button>
                <button class="btn btn-primary next1">Next</button>
              </div>
            </div>

            <div class="form-step ${this.presenter.currentStep === 2 ? 'active' : ''}">
              <div class="barang-list" id="barangList">
                ${this.presenter.formData.barang.map((item, idx) =>
                  this.renderBarangItem(item, idx)
                ).join('')}
              </div>

              <button class="btn btn-add-item" id="addItemBtn"><span>+</span> Tambah Barang</button>

              <div class="form-navigation">
                <button class="btn btn-link back2">Back</button>
                <button class="btn btn-primary next2">Next</button>
              </div>
            </div>

            <div class="form-step ${this.presenter.currentStep === 3 ? 'active' : ''}">
              <div class="date-section">

                <div class="date-input"> 
                  <label>
                    <img src="/logo/calendar-black.png" class="icon-calendar" />
                    Tanggal Sewa
                  </label>
                  <input type="date" id="tanggalSewa" value="${this.presenter.formData.tanggal.sewa}">
                </div>

                <div class="date-input">
                  <label>
                    <img src="/logo/calendar-black.png" class="icon-calendar" />
                    Tanggal Kembali
                  </label>
                  <input type="date" id="tanggalKembali" value="${this.presenter.formData.tanggal.kembali}">
                </div>

              </div>

              <div class="form-navigation">
                <button class="btn btn-link back3">Back</button>
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
          ${this.presenter.formData.barang.length > 1 ? `<button class="btn-remove" data-index="${idx}">✕</button>` : ''}
        </div>

        <select class="barang-select" data-index="${idx}">
          <option value="">Pilih Barang ${idx + 1}</option>
          ${this.presenter.availableItems.map(avail => `
            <option value="${avail.id}" ${item.nama === avail.id ? 'selected' : ''}>${avail.name}</option>
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

  _saveCurrentInputValues() {
  // Step 1
  if (this.presenter.currentStep === 1) {
    ['nama','alamat','nomorTelepon'].forEach(id => {
      const el = document.getElementById(id);
      if (el) this.presenter.formData.penyewa[id] = el.value;
    });
  }

  // Step 2
  if (this.presenter.currentStep === 2) {
    document.querySelectorAll('.barang-item').forEach(itemEl => {
      const idx = parseInt(itemEl.dataset.index);
      const select = itemEl.querySelector('.barang-select');
      const qty = parseInt(itemEl.querySelector('.qty-display').textContent);
      const include = itemEl.querySelector('.include-model-checkbox').checked;

      this.presenter.formData.barang[idx].nama = select.value;
      this.presenter.formData.barang[idx].jumlah = qty;
      this.presenter.formData.barang[idx].includeModel = include;
    });
  }

  // Step 3
  if (this.presenter.currentStep === 3) {
    ['tanggalSewa', 'tanggalKembali'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        const field = id.replace('tanggal','').toLowerCase();
        this.presenter.formData.tanggal[field] = el.value;
      }
    });
  }
}



async afterRender() {
  const container = document.querySelector("#main-content");
  container.innerHTML = await this.render();

  // fetch barang bila belum pernah dimuat
  if (this.presenter.availableItems.length === 0) {
    await this.presenter.loadBarangFromAPI();
  }

  this._bindEvents();
}


  _bindEvents() {
    // Step 1
    document.querySelector('.next1')?.addEventListener('click', () => {
      if (this.presenter.validateStep1()) {
        this.presenter.nextStep(2);
      }
    });

    ['nama', 'alamat', 'nomorTelepon'].forEach(id => {
      document.getElementById(id)?.addEventListener('input', e => {
        this.presenter.updatePenyewaField(id, e.target.value);
      });
    });

    // Step 2
    document.querySelector('.next2')?.addEventListener('click', () => {
      if (this.presenter.validateStep2()) {
        this.presenter.nextStep(3);
      }
    });

    document.querySelector('.back2')?.addEventListener('click', () => {
      this.presenter.nextStep(1);
    });

    document.querySelectorAll('.barang-select').forEach(sel =>
      sel.addEventListener('change', e => {
        this.presenter.updateBarangSelect(parseInt(e.target.dataset.index), e.target.value);
      })
    );

    document.querySelectorAll('.qty-btn').forEach(btn =>
      btn.addEventListener('click', e => {
        const index = parseInt(e.target.dataset.index);
        const increment = e.target.classList.contains('minus') ? -1 : 1;
        this.presenter.updateBarangJumlah(index, increment);
        this.afterRender();
      })
    );

    document.querySelectorAll('.include-model-checkbox').forEach(cb =>
      cb.addEventListener('change', e => {
        this.presenter.updateIncludeModel(parseInt(e.target.dataset.index), e.target.checked);
      })
    );

 document.getElementById('addItemBtn')?.addEventListener('click', () => {
  this._saveCurrentInputValues(); // simpan input saat ini
  this.presenter.addBarang();     // baru tambah barang dan render ulang
});


    document.querySelectorAll('.btn-remove').forEach(btn =>
      btn.addEventListener('click', e => {
        this.presenter.removeBarang(parseInt(e.target.dataset.index));
      })
    );

    // Step 3
    document.querySelector('.back3')?.addEventListener('click', () => {
      this.presenter.nextStep(2);
    });

    ['tanggalSewa', 'tanggalKembali'].forEach(id =>
      document.getElementById(id)?.addEventListener('change', e => {
        const field = id.replace('tanggal', '').toLowerCase();
        this.presenter.updateTanggal(field, e.target.value);
      })
    );

    document.querySelector('.submit-btn')?.addEventListener('click', () => {
      if (this.presenter.validateStep3()) {
        this.presenter.submitForm();
      }
    });
  }
}

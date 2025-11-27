import SewaPagePresenter from "./SewaPage-Presenter.js";

export default class SewaPage {
  constructor() {
    this.presenter = new SewaPagePresenter(this);
  }

  async render() {
    return `
      <section class="sewa-container">
        <div class="header-section">
          <h2>Daftar Transaksi Penyewaan</h2>
          <button id="tambahSewaBtn" class="btn-tambah">+ Tambah Sewa</button>
        </div>

        <div class="list-wrap">
          <div class="tab-container">
            <button class="tab-btn active" data-tab="disewa">Sedang Disewa</button>
            <button class="tab-btn" data-tab="kembali">Sudah Kembali</button>
          </div>

          <div class="filter-wrap">
            <div class="search-box">
  <input type="text" id="searchInput" class="search-id-input" placeholder="Search word..." />
  <img src="/logo/search.png" alt="Search" class="search-icon" />
</div>



            <div class="table-container">
              <table class="sewa-table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Nama Barang</th>
                    <th>Jumlah</th>
                    <th>Nama Penyewa</th>
                    <th>Tanggal Kembali</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody id="tableBody"></tbody>
              </table>
            </div>
          </div>
        </div>
        <div id="kelolaOverlay" class="overlay hidden">
  <div class="overlay-content">
    <h3>Kelola Transaksi</h3>
    <form id="kelolaForm">
      <div class="form-group">
        <label>Nama Penyewa</label>
        <input type="text" id="namaPenyewa" readonly />
      </div>
      <div class="form-group">
        <label>Nama Barang & Jumlah</label>
        <input type="text" id="namaBarangJumlah" readonly />
      </div>
      <div class="form-group">
        <label>Tanggal Kembali</label>
        <input type="date" id="tanggalKembali" readonly />
      </div>
      <div class="form-group">
        <label>Tanggal Kembali Sebenarnya</label>
        <input type="date" id="tanggalKembaliSebenarnya" required />
      </div>
      <div class="form-group">
        <label>Denda Keterlambatan (Rp)</label>
        <input type="number" id="dendaKeterlambatan" readonly value="0" />
      </div>
      <div class="form-group">
        <label>Denda Lain-lain (Rp)</label>
        <input type="number" id="dendaLain" value="0" />
      </div>
      <button type="submit" class="btn btn-primary">Simpan</button>
      <button type="button" id="closeOverlay" class="btn btn-link">Tutup</button>
    </form>
  </div>
</div>

      </section>
    `;
  }

  async afterRender() {
    await this._injectContent(); // pastikan DOM sudah ada
    this.presenter.afterRender();
  }

  unmount() {
    this.presenter.unmount();
  }

  async _injectContent() {
    const container = document.querySelector("#main-content");
    if (!container) return console.error("❌ #main-content tidak ditemukan!");
    container.innerHTML = await this.render();
  }
}

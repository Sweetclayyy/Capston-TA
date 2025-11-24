import "../../components/Navbar.js";
import StokPagePresenter from "./StokPage-Presenter.js";
import initGlobalScrollAnimation from '../../components/scroll-animation.js';

export default class StokPage {
  constructor() {
    this.presenter = new StokPagePresenter(this);
    this.navClickHandlers = [];
  }

  async render() {
    return `
<section class="stok-container">
  <div class="stok-wrapper">
        <h2 class="judul scroll-animate">Menejemen Stok </h2>
  <div class="stok-stats scroll-animate">
  <div class="stat-card-stok scroll-animate">
    <h3>Jumlah Baju Disewa</h3>
    <p class="stat-number-stok ">125</p>
  </div>
  <div class="stat-card-stok scroll-animate">
    <h3>Jumlah Stok Baju</h3>
    <p class="stat-number-stok ">84</p>
  </div>
  <div class="stat-card-stok scroll-animate">
    <h3>Jumlah Baju Kembali</h3>
    <p class="stat-number-stok">73</p>
  </div>
</div>

    <header class="stok-header scroll-animate">
      <h2>Katalog Produk</h2>
      <div class="stok-actions ">
        <label for="filterKategori">Filter Kategori:</label>
        <select id="filterKategori" class="filter-dropdown">
          <option value="all">All Category</option>
          <option value="designer">Designer</option>
          <option value="kostum">Kostum</option>
        </select>
        <button id="addStockBtn" class="btn-tambah">+ Tambah Stok</button>
      </div>
      
    </header>
<div class="stok-search scroll-animate">
  <input
    type="text"
    id="searchInput"
    placeholder="Cari produk berdasarkan nama..."
    class="search-bar"
  />
  <img src="/logo/search.png" alt="Search Icon" class="search-icon" />
</div>

    <section id="stokGrid" class="stok-grid scroll-animate"></section>

<div id="stokModal" class="stok-modal-overlay hidden">
  <div class="stok-modal-card">
    <span id="closeModal" class="close-btn">&times;</span>
    <img id="modalImage" class="modal-img" alt="Detail Gambar" />
    <h3 id="modalName"></h3>
    <p id="modalStock"></p>
    <p id="modalPrice"></p>
  </div>
</div>

<div id="stokFormOverlay" class="stok-modal-overlay hidden">
  <div class="stok-modal-card form-card">
    <span id="closeFormModal" class="close-btn">&times;</span>
    <h2>+ Tambah Stok Baru</h2>
<form id="stokForm">
  <div class="form-group">
    <label for="namaBarang">Nama Barang</label>
    <input type="text" id="namaBarang" placeholder="Masukkan nama barang" required>
  </div>
  <div class="form-group">
    <label for="kategoriBarang">Kategori</label>
    <select id="kategoriBarang" required>
      <option value="">Pilih Kategori</option>
      <option value="designer">Designer</option>
      <option value="kostum">Kostum</option>
    </select>
  </div>
  <div class="form-group">
    <label for="stokBarang">Jumlah Stok</label>
    <input type="number" id="stokBarang" min="1" required>
  </div>
  <div class="form-group">
    <label for="hargaBarang">Harga</label>
    <input type="number" id="hargaBarang" min="0" required>
  </div>
  <div class="form-group">
    <label for="gambarBarang">Gambar Barang</label>
    <input type="file" id="gambarBarang" accept="image/*" required>
    <div id="previewContainer" class="preview-container hidden">
      <img id="previewImage" alt="Preview Gambar" class="preview-img">
    </div>
  </div>
  <button type="submit" class="btn-submit">Simpan Stok</button>
</form>

  </div>
</div>


    <div class="pagination scroll-animate">
      <span class="page-btn" id="prevPage">&lt;</span>
      <span class="page-number active">1</span>
      <span class="page-number">2</span>
      <span class="page-btn" id="nextPage">&gt;</span>
    </div>
  </div>

  
</section>

    `;
  }

  async afterRender() {
    await this._injectContent();
    await this.presenter.renderStockList();
    this.presenter.handleFilter();
    this.presenter.handleAddStock();
    initGlobalScrollAnimation();
  }

  async _injectContent() {
    const container = document.querySelector("#main-content");
    if (!container) return console.error("#main-content tidak ditemukan!");
    container.innerHTML = await this.render();
  }

  unmount() {
    this.navClickHandlers.forEach(({ element, callback }) =>
      element.removeEventListener("click", callback)
    );
    this.navClickHandlers = [];
    console.log("StokPage unmounted: listeners cleaned up.");
  }
}

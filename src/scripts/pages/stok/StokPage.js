import "../../components/Navbar.js";
import StokPagePresenter from "./StokPage-Presenter.js";

export default class StokPage {
  constructor() {
    this.presenter = new StokPagePresenter(this);
    this.navClickHandlers = [];
  }

  async render() {
    return `
<section class="stok-container">
  <div class="stok-wrapper">
    <header class="stok-header">
      <h2>Katalog Produk</h2>
      <div class="stok-actions">
        <label for="filterKategori">Filter Kategori:</label>
        <select id="filterKategori" class="filter-dropdown">
          <option value="all">All Category</option>
          <option value="designer">Designer</option>
          <option value="kostum">Kostum</option>
        </select>
        <button id="addStockBtn" class="btn-tambah">+ Tambah Stok</button>
      </div>
      
    </header>
<div class="stok-search">
  <input
    type="text"
    id="searchInput"
    placeholder="Cari produk berdasarkan nama..."
    class="search-bar"
  />
  <img src="/logo/search.png" alt="Search Icon" class="search-icon" />
</div>

    <section id="stokGrid" class="stok-grid"></section>

    <!-- Modal Detail Produk -->
<div id="stokModal" class="stok-modal-overlay hidden">
  <div class="stok-modal-card">
    <span id="closeModal" class="close-btn">&times;</span>
    <img id="modalImage" class="modal-img" alt="Detail Gambar" />
    <h3 id="modalName"></h3>
    <p id="modalStock"></p>
    <p id="modalPrice"></p>
  </div>
</div>


    <div class="pagination">
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
  }

  async _injectContent() {
    const container = document.querySelector("#main-content");
    if (!container) return console.error("❌ #main-content tidak ditemukan!");
    container.innerHTML = await this.render();
  }

  unmount() {
    this.navClickHandlers.forEach(({ element, callback }) =>
      element.removeEventListener("click", callback)
    );
    this.navClickHandlers = [];
    console.log("✅ StokPage unmounted: listeners cleaned up.");
  }
}

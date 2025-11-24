import "../../components/Navbar.js";
import LaporanKeuanganPresenter from "./LaporanKeuangan-Presenter.js";
import initGlobalScrollAnimation from "../../components/scroll-animation.js";

export default class LaporanKeuanganPage {
  constructor() {
    this.presenter = new LaporanKeuanganPresenter(this);
    this.navClickHandlers = [];
  }

  async render() {
    return `
<section class="laporan-container">
  <div class="laporan-wrapper">

<header class="laporan-header scroll-animate">

  <div class="bulan-group">
    <div class="bulan-nav">
      <button id="bulanIniBtn" class="btn-bulan active">
        <img src="/logo/money-green.png" class="bulan-icon" />
        <span>Bulan Ini</span>
      </button>

      <button id="bulanLaluBtn" class="btn-bulan">
        <img src="/logo/search-orange.png" class="bulan-icon" />
        <span>Bulan Lalu</span>
      </button>
    </div>

    <!-- Search by ID DI BAWAH tombol bulan -->
    <div class="search-id-wrapper scroll-animate">
      <input 
        type="text" 
        id="searchByIdInput" 
        class="search-id-input"
        placeholder="Cari berdasarkan ID Transaksi..."
      />
      <img src="/logo/search.png" class="search-id-icon" />
    </div>
  </div>

  <div class="choose-month-wrapper">
    <button id="chooseMonthBtn" class="btn-choose-month">
      <img src="/logo/calendar.png" alt="Calendar" />
      Pilih Bulan
    </button>
  </div>

</header>


<!-- --- Modal Year-Month Picker --- -->
<div id="yearMonthModal" class="ym-modal hidden">
  <div class="ym-modal-card">
    <div class="ym-modal-header">
      <select id="ymYearSelect" class="ym-year-select"></select>
      <button id="ymCloseBtn" class="ym-close">&times;</button>
    </div>
    <div class="ym-month-grid" id="ymMonthGrid">
    </div>
    <div class="ym-footer">
      <button id="ymClearBtn" class="ym-ghost">Batal</button>
      <button id="ymDoneBtn" class="ym-primary">Selesai</button>

    </div>
  </div>
</div>

    <!-- Tabel -->
    <div class="tabel-wrapper scroll-animate">
      <h2 class="juduLaporan scroll-animate" id="judulLaporan">
      Laporan Keuangan: Januari 2024
    </h2>
      <table class="laporan-table">
        <thead>
          <tr>
            <th>ID Transaksi</th>
            <th>Tanggal Sewa</th>
            <th>Tanggal Kembali</th>
            <th>Total Harga Sewa</th>
            <th>Keuntungan Model</th>
            <th>Keuntungan Designer</th>
            <th>Keuntungan Bersih</th>
            <th> </th>
          </tr>
        </thead>

        <tbody id="laporanTableBody">
          <!-- DATA DIISI PRESENTER -->
        </tbody>
      </table>
    </div>

    <!-- Total -->
    <div class="laporan-total scroll-animate">
      <span>Keuntungan Total :</span>
      <span id="totalKeuntungan">Rp0</span>
    </div>

  </div>
  <div id="detailModal" class="detail-modal hidden">
  <div class="detail-card">
    <div class="detail-header">
<span class="detail-wrapper">
  <img src="/logo/detail.png" alt="Detail" class="icon-detail">
  Detail Transaksi
</span>


      <button id="detailCloseBtn" class="detail-close">&times;</button>
    </div>

    <div id="detailContent" class="detail-content">
      <!-- Dynamic -->
    </div>
  </div>
</div>

</section>
    `;
  }

  async afterRender() {
    await this._injectContent();

    // Minta presenter load data
    await this.presenter.loadDataDefault();

    // Handler tombol
    this.presenter.handleChangeMonth();
    this.presenter.handleCustomMonth();
    this.presenter.handleSearchById();

    // Animasi scroll
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
    console.log("LaporanKeuanganPage unmounted: listeners cleaned up.");
  }
}

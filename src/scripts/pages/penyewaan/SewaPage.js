// src/pages/penyewaan/SewaPage.js

export default class SewaPage {
  constructor() {
    this.dataSewa = [
      {
        id: 1,
        namaBarang: "Set Kebaya 1",
        jumlah: 1,
        namaPenyewa: "Citra Oktafiana",
        tanggal: "17/07/2025",
        status: "Belum Kembali",
      },
      {
        id: 2,
        namaBarang: "Set Kebaya 4",
        jumlah: 1,
        namaPenyewa: "Siti Aminah",
        tanggal: "15/07/2025",
        status: "Belum Kembali",
      },
      {
        id: 3,
        namaBarang: "Set Kebaya 1",
        jumlah: 1,
        namaPenyewa: "Citra Oktafiana",
        tanggal: "20/07/2025",
        status: "Selesai",
      },
      {
        id: 4,
        namaBarang: "Set Kebaya 4",
        jumlah: 1,
        namaPenyewa: "Siti Aminah",
        tanggal: "18/07/2025",
        status: "Selesai",
      },
    ];

    this.activeTab = "disewa";
    this.navClickHandlers = [];
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
              <input type="text" id="searchInput" placeholder="Search word..." />
              <span class="search-icon">🔍</span>
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
      </section>
    `;
  }

  async afterRender() {
    await this._injectContent();
    this._bindEvents();
    this._renderTable();
  }

  unmount() {
    this.navClickHandlers.forEach(({ element, callback }) =>
      element.removeEventListener("click", callback)
    );
    this.navClickHandlers = [];
    console.log("✅ SewaPage unmounted: listeners cleaned up.");
  }

  async _injectContent() {
    const container = document.querySelector("#main-content");
    if (!container) return console.error("❌ #main-content tidak ditemukan!");
    container.innerHTML = await this.render();
  }

  _bindEvents() {
    const tabButtons = document.querySelectorAll(".tab-btn");
    const searchInput = document.getElementById("searchInput");
    const tambahBtn = document.getElementById("tambahSewaBtn");

    // Tab switching
    tabButtons.forEach((btn) => {
      const handler = () => {
        tabButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        this.activeTab = btn.dataset.tab;
        this._renderTable();
      };
      btn.addEventListener("click", handler);
      this.navClickHandlers.push({ element: btn, callback: handler });
    });

    // Search
    const searchHandler = () => this._renderTable();
    searchInput.addEventListener("input", searchHandler);
    this.navClickHandlers.push({ element: searchInput, callback: searchHandler });

    // Tambah sewa
    const tambahHandler = () => {
      window.location.hash = "#/sewaForm";
    };
    tambahBtn.addEventListener("click", tambahHandler);
    this.navClickHandlers.push({ element: tambahBtn, callback: tambahHandler });
  }

  _renderTable() {
    const tableBody = document.getElementById("tableBody");
    if (!tableBody) return;

    const keyword = document.getElementById("searchInput")?.value.toLowerCase() || "";

    const filtered = this.dataSewa.filter((item) => {
      const matchTab =
        this.activeTab === "disewa"
          ? item.status === "Belum Kembali"
          : item.status === "Selesai";

      const matchSearch =
        item.namaBarang.toLowerCase().includes(keyword) ||
        item.namaPenyewa.toLowerCase().includes(keyword);

      return matchTab && matchSearch;
    });

    tableBody.innerHTML = filtered
      .map(
        (item, index) => `
          <tr>
            <td>${index + 1}</td>
            <td>${item.namaBarang}</td>
            <td>${item.jumlah}</td>
            <td>${item.namaPenyewa}</td>
            <td>${item.tanggal}</td>
            <td>
              <span class="status ${
                item.status === "Selesai" ? "selesai" : "belum"
              }">${item.status}</span>
            </td>
          </tr>
        `
      )
      .join("");
  }
}
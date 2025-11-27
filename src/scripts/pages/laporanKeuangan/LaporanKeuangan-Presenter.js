// === LaporanKeuangan-Presenter.js ===
export default class LaporanKeuanganPresenter {
  constructor(page) {
    this.page = page;
    this.apiMode = true;

    this.currentMonth = this._getCurrentYYYYMM();
    this.navListeners = [];
    this.yearRange = { start: new Date().getFullYear() - 5, end: new Date().getFullYear() + 2 };
  }

  async loadDataDefault() {
    this._updateTitleFromMonth(this.currentMonth);
    const data = await this._fetchData(this.currentMonth);
    this._renderTable(data);
  }

  _getCurrentYYYYMM() {
    const now = new Date();
    const mm = (now.getMonth() + 1).toString().padStart(2, "0");
    return `${now.getFullYear()}-${mm}`;
  }

  handleChangeMonth() {
    const bulanIniBtn = document.getElementById("bulanIniBtn");
    const bulanLaluBtn = document.getElementById("bulanLaluBtn");
    const chooseMonthBtn = document.getElementById("chooseMonthBtn");

    // BULAN INI
    if (bulanIniBtn) {
      const cb = async () => {
        bulanIniBtn.classList.add("active");
        bulanLaluBtn.classList.remove("active");

        this.currentMonth = this._getCurrentYYYYMM();
        this._updateTitleFromMonth(this.currentMonth);

        const data = await this._fetchData(this.currentMonth);
        this._renderTable(data);
      };
      bulanIniBtn.addEventListener("click", cb);
      this.navListeners.push({ element: bulanIniBtn, cb });
    }

    // BULAN LALU
    if (bulanLaluBtn) {
      const cb2 = async () => {
        bulanLaluBtn.classList.add("active");
        bulanIniBtn.classList.remove("active");

        const now = new Date();
        now.setMonth(now.getMonth() - 1);
        const mm = (now.getMonth() + 1).toString().padStart(2, "0");

        this.currentMonth = `${now.getFullYear()}-${mm}`;
        this._updateTitleFromMonth(this.currentMonth);

        const data = await this._fetchData(this.currentMonth);
        this._renderTable(data);
      };
      bulanLaluBtn.addEventListener("click", cb2);
      this.navListeners.push({ element: bulanLaluBtn, cb: cb2 });
    }

    // BUKA MODAL PICKER
    if (chooseMonthBtn) {
      const cb3 = (e) => {
        e.preventDefault();
        this._openYearMonthModal();
      };
      chooseMonthBtn.addEventListener("click", cb3);
      this.navListeners.push({ element: chooseMonthBtn, cb: cb3 });
    }

    // Init modal
    this._initYearMonthModalDOM();
  }

  handleCustomMonth() { return; }

  handleSearchById() {
    const input = document.querySelector("#searchByIdInput");
    if (!input) return;

    input.addEventListener("input", () => {
      const keyword = input.value.trim().toLowerCase();
      const rows = document.querySelectorAll("#laporanTableBody tr");

      rows.forEach(row => {
        const idCell = row.querySelector("td:first-child");
        const match = idCell.textContent.toLowerCase().includes(keyword);

        row.style.display = match ? "" : "none";
      });
    });
  }

  // ===== MODAL =====
  _initYearMonthModalDOM() {
    const modal = document.getElementById("yearMonthModal");
    const yearSelect = document.getElementById("ymYearSelect");
    const monthGrid = document.getElementById("ymMonthGrid");
    const closeBtn = document.getElementById("ymCloseBtn");
    const clearBtn = document.getElementById("ymClearBtn");
    const doneBtn = document.getElementById("ymDoneBtn");

    if (!modal || !yearSelect || !monthGrid) return;

    // Populate Tahun
    yearSelect.innerHTML = "";
    for (let y = this.yearRange.start; y <= this.yearRange.end; y++) {
      const opt = document.createElement("option");
      opt.value = String(y);
      opt.textContent = String(y);
      if (String(y) === this.currentMonth.split("-")[0]) opt.selected = true;
      yearSelect.appendChild(opt);
    }

    // Populate Bulan
    monthGrid.innerHTML = "";
    const monthNames = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];
    const selectedYear = yearSelect.value;

    monthNames.forEach((mName, idx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "ym-month-btn";
      btn.dataset.month = String(idx + 1).padStart(2, "0");
      btn.textContent = mName;

      const [cy, cm] = this.currentMonth.split("-");
      if (cy === selectedYear && cm === btn.dataset.month) {
        btn.classList.add("active");
      }

      monthGrid.appendChild(btn);

      const onMonthClick = () => {
        monthGrid.querySelectorAll(".ym-month-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
      };

      btn.addEventListener("click", onMonthClick);
      this.navListeners.push({ element: btn, cb: onMonthClick });
    });

    // Tahun berubah
    const onYearChange = () => {
      const tahun = yearSelect.value;
      const [cy, cm] = this.currentMonth.split("-");

      monthGrid.querySelectorAll(".ym-month-btn").forEach(b => {
        if (tahun === cy && b.dataset.month === cm) b.classList.add("active");
        else b.classList.remove("active");
      });
    };
    yearSelect.addEventListener("change", onYearChange);
    this.navListeners.push({ element: yearSelect, cb: onYearChange });

    // CLOSE
    if (closeBtn) {
      const cbClose = () => this._closeYearMonthModal();
      closeBtn.addEventListener("click", cbClose);
      this.navListeners.push({ element: closeBtn, cb: cbClose });
    }

    // BATAL
    if (clearBtn) {
      const cbClear = () => this._closeYearMonthModal();
      clearBtn.addEventListener("click", cbClear);
      this.navListeners.push({ element: clearBtn, cb: cbClear });
    }

    // SELESAI
    if (doneBtn) {
      const cbDone = async () => {
        const year = yearSelect.value;
        const activeBtn = monthGrid.querySelector(".ym-month-btn.active");
        if (!activeBtn) return alert("Pilih bulan terlebih dahulu.");

        const month = activeBtn.dataset.month;

        this.currentMonth = `${year}-${month}`;

        document.getElementById("bulanIniBtn")?.classList.remove("active");
        document.getElementById("bulanLaluBtn")?.classList.remove("active");

        this._updateTitleFromMonth(this.currentMonth);
        const data = await this._fetchData(this.currentMonth);
        this._renderTable(data);

        this._closeYearMonthModal();
      };

      doneBtn.addEventListener("click", cbDone);
      this.navListeners.push({ element: doneBtn, cb: cbDone });
    }

    modal.addEventListener("click", (ev) => {
      if (ev.target === modal) this._closeYearMonthModal();
    });
  }

  _openYearMonthModal() {
    document.getElementById("yearMonthModal")?.classList.remove("hidden");
  }

  _closeYearMonthModal() {
    document.getElementById("yearMonthModal")?.classList.add("hidden");
  }

  async _fetchData(month) {
    try {
      const res = await fetch(`http://localhost:5000/api/laporan?month=${month}`);
      const json = await res.json();

      // Normalisasi data supaya cocok dengan renderer
      return json.map(item => ({
        id: item.id,
        tgl_sewa: item.tgl_sewa,
        tgl_kembali: item.tgl_kembali,
        penyewa: item.penyewa,
        include_model: item.barang?.[0]?.include_model || 0,
        denda_telat: item.denda_keterlambatan || 0,
        denda_lain: item.denda_lain || 0,
        total_harga: item.total_harga || 0,
        total: (item.total_harga || 0) + (item.denda_keterlambatan || 0) + (item.denda_lain || 0),
        keuntungan_model: item.keuntungan_model || 0,
        keuntungan_designer: item.keuntungan_designer || 0,
        barang: item.barang?.map(b => ({
          nama: b.namaBarang,
          kategori: b.kategori,
          harga: b.harga_barang,
          qty: b.jumlah
        })) || [],
        customer: { nama: item.customer?.nama, telp: item.customer?.telp }
      }));
    } catch (err) {
      console.error(err);
      alert("Gagal memuat data server.");
      return [];
    }
  }

  _renderTable(data) {
    const tbody = document.getElementById("laporanTableBody");
    const totalEl = document.getElementById("totalKeuntungan");
    if (!tbody) return;

    tbody.innerHTML = "";
    let total = 0;

    data.forEach(row => {
      const km = row.keuntungan_model || 0;
      const kd = row.keuntungan_designer || 0;
      const dendaTelat = row.denda_telat || 0;

// Keuntungan bersih = total_harga - keuntungan_designer + denda keterlambatan
const bersih = (row.total_harga || 0) - kd + dendaTelat;
      total += bersih;

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${row.id}</td>
        <td>${this._formatTanggal(row.tgl_sewa)}</td>
<td>${this._formatTanggal(row.tgl_kembali)}</td>

        <td>${this._formatRupiah(row.total_harga)}</td>
        <td>${this._formatRupiah(km)}</td>
        <td>${kd ? this._formatRupiah(kd) : "-"}</td>
        <td>${this._formatRupiah(bersih)}</td>
        <td><button class="seemoreBtn" data-id="${row.id}">⋮</button></td>
      `;
      tbody.appendChild(tr);
    });

    totalEl.textContent = this._formatRupiah(total);
    this._latestData = data;
    this._addDetailListeners();
  }

  _addDetailListeners() {
    document.querySelectorAll(".seemoreBtn").forEach(btn => {
      btn.addEventListener("click", () => {
        this._openDetail(btn.dataset.id);
      });
    });
  }

  _openDetail(id) {
    const data = this._latestData.find(x => x.id === id);
    const detail = document.getElementById("detailContent");
    const modal = document.getElementById("detailModal");
    if (!data) return;

    let barangHtml = data.barang
      .map(b => `
        <div class="detail-barang">
          <span>${b.nama} <small class="barang-kategori">(${b.kategori})</small></span>
          <span>${this._formatRupiah(b.harga)} × ${b.qty}</span>
        </div>
      `)
      .join("");

    detail.innerHTML = `
      <p><strong>ID Transaksi:</strong> ${data.id}</p>
      <p><strong>Nama Penyewa:</strong> ${data.penyewa}</p>
      <p><strong>No. Telp:</strong> ${data.customer?.telp ?? "-"}</p>

      <p><strong>Include Model:</strong> ${data.include_model ? "Ya" : "Tidak"}</p>

      <hr>

      <p><strong>Barang Disewa:</strong></p>
      ${barangHtml}

      <hr>

      <p><strong>Tanggal Sewa:</strong> ${this._formatTanggal(data.tgl_sewa)}</p>
<p><strong>Tanggal Kembali:</strong> ${this._formatTanggal(data.tgl_kembali)}</p>


      <hr>

      <p><strong>Denda Keterlambatan:</strong> ${this._formatRupiah(data.denda_telat)}</p>
      <p><strong>Denda Lain-lain:</strong> ${this._formatRupiah(data.denda_lain)}</p>

      <hr>

      <p><strong>Total Harga Sewa:</strong> ${this._formatRupiah(data.total_harga)}</p>
      <p><strong>Total Semua (Termasuk Denda):</strong> ${this._formatRupiah(data.total)}</p>

      <p><strong>Keuntungan Model:</strong> ${this._formatRupiah(data.keuntungan_model)}</p>
      <p><strong>Keuntungan Designer:</strong> ${this._formatRupiah(data.keuntungan_designer)}</p>

    <p class="detail-total-bersih">
  Total Bersih: ${this._formatRupiah(
    (data.total_harga || 0) - (data.keuntungan_designer || 0) + (data.denda_telat || 0)
  )}
</p>

    `;

    modal.classList.remove("hidden");
  }

  _formatRupiah(n) {
    return "Rp" + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  _updateTitleFromMonth(month) {
    const [y, m] = month.split("-");
    document.getElementById("judulLaporan").textContent =
      `Laporan Keuangan: ${[
        "Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"
      ][parseInt(m) - 1]} ${y}`;
  }

  _formatTanggal(str) {
  if (!str) return "-";
  const d = new Date(str);
  if (isNaN(d)) return str;
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

  destroy() {
    this.navListeners.forEach(({ element, cb }) => {
      element.removeEventListener("click", cb);
      element.removeEventListener("change", cb);
    });
    this.navListeners = [];
  }
}




document.addEventListener("click", e => {
  if (e.target.id === "detailCloseBtn") {
    document.getElementById("detailModal").classList.add("hidden");
  }
});

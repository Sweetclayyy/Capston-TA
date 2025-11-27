
export default class SewaPagePresenter {
constructor(page) {
  this.page = page;
  this.dataSewa = [];
  this.activeTab = "disewa";
  this.navClickHandlers = [];
}


async afterRender() {
  this._bindEvents();
  await this.loadData();
}

async loadData() {
  try {
    const url = this.activeTab === "disewa"
      ? "http://localhost:5000/api/sewa"
      : "http://localhost:5000/api/sewa/selesai";

    const res = await fetch(url);
    const data = await res.json();

    this.dataSewa = data.map(item => {
  // gabungkan semua barang jadi string dengan <br> untuk layout atas-bawah
  const barangGabungan = (item.items || [])
    .map(i => `${i.namaBarang || "-"} x${i.jumlah ?? 0}`)
    .join("<br>");

  return {
    id: item.id,
    namaBarang: barangGabungan || "-",
    namaPenyewa: item.namaPenyewa || "-",
    tanggal: item.tanggalKembali || "-",
    status: item.status || "Belum Kembali",
    items: item.items || [] // simpan juga array aslinya biar bisa dipakai di overlay
  };
});

    this._renderTable();
  } catch (err) {
    console.error("Gagal load data:", err);
  }
}




  unmount() {
    this.navClickHandlers.forEach(({ element, callback }) =>
      element.removeEventListener("click", callback)
    );
    this.navClickHandlers = [];
    console.log("✅ SewaPagePresenter unmounted: listeners cleaned up.");
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

  function convertToMySQLDate(str) {
  if (!str) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str; // sudah format MySQL
  const [d, m, y] = str.split("/");
  return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
}

    const tableBody = document.getElementById("tableBody");
    if (!tableBody) return;

    const keyword = document.getElementById("searchInput")?.value.toLowerCase() || "";

    const filtered = this.dataSewa.filter((item) => {
      const matchTab =
        this.activeTab === "disewa"
          ? item.status === "Belum Kembali"
          : item.status === "Sudah Kembali";

      const matchSearch =
        item.namaBarang.toLowerCase().includes(keyword) ||
        item.namaPenyewa.toLowerCase().includes(keyword);

      return matchTab && matchSearch;
    });

    tableBody.innerHTML = filtered
  .map((item, index) => `
    <tr data-id="${item.id}">
      <td>${index + 1}</td>
      <td>${item.items.map(i => i.namaBarang).join("<br>") || "-"}</td>
      <td>${item.items.map(i => i.jumlah).join("<br>") || "-"}</td>
      <td>${item.namaPenyewa}</td>
      <td>${item.tanggal}</td>
      <td>
        <span class="status ${item.status === "Selesai" ? "selesai" : "belum"}">${item.status}</span>
        ${item.status === "Belum Kembali" ? `<button class="btn-kelola">Kelola</button>` : ""}
      </td>
    </tr>
  `).join("");


    // Bind event Kelola setelah tabel dirender
    tableBody.querySelectorAll(".btn-kelola").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const tr = e.target.closest("tr");
        const id = Number(tr.dataset.id);
        const data = this.dataSewa.find((d) => d.id === id);

        // isi form overlay
        const tglKembaliInput = document.getElementById("tanggalKembali");
        const tglSebenarnyaInput = document.getElementById("tanggalKembaliSebenarnya");
        const dendaKeterlambatanInput = document.getElementById("dendaKeterlambatan");

        document.getElementById("namaPenyewa").value = data.namaPenyewa;
        document.getElementById("namaBarangJumlah").value = `${data.namaBarang} x${data.jumlah}`;
        tglKembaliInput.value = convertToInputDate(data.tanggal);
        tglSebenarnyaInput.value = "";
        dendaKeterlambatanInput.value = 0;
        document.getElementById("dendaLain").value = 0;

        document.getElementById("kelolaOverlay").classList.remove("hidden");

        // Hitung otomatis denda keterlambatan saat tanggal kembali sebenarnya diubah
        tglSebenarnyaInput.addEventListener("input", () => {
          const tglKembali = new Date(data.tanggal.split("/").reverse().join("-"));
          const tglSebenarnya = new Date(tglSebenarnyaInput.value);
          const diffDays = Math.ceil((tglSebenarnya - tglKembali) / (1000 * 60 * 60 * 24));
          const denda = diffDays > 0 ? diffDays * 25000 : 0;
          dendaKeterlambatanInput.value = denda;
        });

        // submit overlay
        const kelolaForm = document.getElementById("kelolaForm");
kelolaForm.onsubmit = async (ev) => {
  ev.preventDefault();

  const dendaKeterlambatan = Number(dendaKeterlambatanInput.value);
  const dendaLain = Number(document.getElementById("dendaLain").value);

  // Konversi tanggal ke format MySQL
  const tanggalKembaliFormatted = convertToMySQLDate(data.tanggal);
  const tanggalKembaliSebenarnyaFormatted = convertToMySQLDate(tglSebenarnyaInput.value);

  try {
    const res = await fetch("http://localhost:5000/api/kembali", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
body: JSON.stringify({
  sewa_id: data.id,
  namaPenyewa: data.namaPenyewa,
  tanggalKembali: tanggalKembaliFormatted,
  barang: data.items.map(i => ({
    namaBarang: i.namaBarang,
    jumlah: i.jumlah,
    tanggalKembaliSebenarnya: tanggalKembaliSebenarnyaFormatted,
    dendaKeterlambatan,
    dendaLain
  }))
}),

    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.message);

    // Update frontend
    data.status = "Selesai";
    data.dendaKeterlambatan = dendaKeterlambatan;
    data.dendaLain = dendaLain;
    data.tanggalKembaliSebenarnya = tglSebenarnyaInput.value;

    document.getElementById("kelolaOverlay").classList.add("hidden");
    this._renderTable();
    await this.loadData();

    alert("Data berhasil disimpan");
  } catch (err) {
    alert("Gagal simpan data: " + err.message);
  }
};


      });
    });

    // Close overlay
    document.getElementById("closeOverlay").addEventListener("click", () => {
      document.getElementById("kelolaOverlay").classList.add("hidden");
  
    });

function convertToInputDate(str) {
  if (!str) return ""; // aman kalau undefined/null

  // Kalau format sudah YYYY-MM-DD → langsung pakai
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
    return str;
  }

  // Kalau format DD/MM/YYYY → convert
  if (str.includes("/")) {
    const [d, m, y] = str.split("/");
    return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
  }

  return ""; // fallback aman
}





  }
}

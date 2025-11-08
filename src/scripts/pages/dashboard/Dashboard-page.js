import '../../components/HeaderComponent.js';


export default class Dashboard {
  constructor() {
    this.financialChart = null;
    this.growthChart = null;
    this.navClickHandlers = [];
  }

  async render() {
    return `
         <div class="main-content-wrapper">
      <section class="quick-actions-row">
<div class="quick-action-card gradient-sewa" data-href="#/sewa">
  <div class="card-title">
    <img src="/logo/sewa-white.png" alt="Sewa" class="card-icon" />
    <h3>Sewa</h3>
  </div>
  <p>Lakukan proses pencatatan sewa barang disini</p>
  <span class="see-more">Lihat Selengkapnya →</span>
</div>

<div class="quick-action-card gradient-stok" data-href="#/stok">
  <div class="card-title">
    <img src="/logo/stok-white.png" alt="Stok" class="card-icon" />
    <h3>Stok</h3>
  </div>
  <p>Manajemen stok barang sewa</p>
  <span class="see-more">Lihat Selengkapnya →</span>
</div>

<div class="quick-action-card gradient-laporan" data-href="#/laporanKeuangan">
  <div class="card-title">
    <img src="/logo/laporan-white.png" alt="Laporan Keuangan" class="card-icon" />
    <h3>Laporan Keuangan</h3>
  </div>
  <p>Lihat laporan keuangan disini</p>
  <span class="see-more">Lihat Selengkapnya →</span>
</div>

      </section>

      <div class="content-layout">
        <div class="primary-content">
          <section class="analytics-section" data-href="#/laporanKeuangan">
            <h2>Analisis Keuangan</h2>
            <div class="financial-grid">
              <div class="financial-stats">
                <div class="stat-item">
                  <span>Keuntungan bulan ini</span>
                  <strong>Rp17.800.000</strong>
                </div>
                <div class="stat-item">
                  <span>Prediksi keuntungan bulan depan</span>
                  <strong>Rp18.500.000</strong>
                </div>
                <button class="btn-see-more">Lihat Selengkapnya →</button>
              </div>
              <div class="financial-chart">
                <canvas id="financialChart"></canvas>
              </div>
            </div>
          </section>

          <section class="stats-grid">
            <div class="stat-card">
              <div class="stat-title">Jumlah Stok Barang</div>
              <div class="stat-value">38</div>
              <div class="stat-sub">Baju Karnaval</div>
              <div class="stat-sub">20 Baju Designer</div>
            </div>
            <div class="stat-card">
              <div class="stat-title">Jumlah Sewa</div>
              <div class="stat-value">38</div>
              <div class="stat-sub">Barang Disewa</div>
            </div>
            <div class="stat-card">
              <div class="stat-title">Jumlah Kembali</div>
              <div class="stat-value">10</div>
              <div class="stat-sub">Barang Kembali</div>
            </div>
          </section>
        </div>

        <aside class="dashboard-sidebar">
          <div class="sidebar-card growth-chart">
            <h2>Grafik Pertumbuhan Keuangan</h2>
            <div class="chart-placeholder">
              <canvas id="growthChart"></canvas>
            </div>
            <div class="legend">
              <span><i style="background: #FFD2D2;"></i> Bulan Lalu</span>
              <span><i style="background: #4f46e5;"></i> Bulan Ini</span>
            </div>
          </div>

          <div class="sidebar-card growth-summary">
            <div class="summary-title">Pertumbuhan Keuntungan Bulan Ini</div>
            <div class="summary-value">Rp150.000</div>
            <div class="trend-icon">📈</div>
          </div>
        </aside>
         </div>
      </div>
    `;
  }

  async afterRender() {
    await this._injectContent();
    this._bindNavEvents();
    this._loadCharts();
  }

  unmount() {
    if (this.financialChart) {
      this.financialChart.destroy();
      this.financialChart = null;
    }
    if (this.growthChart) {
      this.growthChart.destroy();
      this.growthChart = null;
    }

    this.navClickHandlers.forEach(({ element, callback }) =>
      element.removeEventListener("click", callback)
    );
    this.navClickHandlers = [];

    console.log("✅ Dashboard unmounted: charts & listeners cleaned up.");
  }

  async _injectContent() {
    const container = document.querySelector("#main-content");
    if (!container) return console.error("❌ #main-content tidak ditemukan!");
    container.innerHTML = await this.render();
  }

  _bindNavEvents() {
    document.querySelectorAll("[data-href]").forEach((el) => {
      const handler = (e) => {
        e.preventDefault();
        const href = el.getAttribute("data-href");
        window.location.hash = href;
      };
      el.addEventListener("click", handler);
      this.navClickHandlers.push({ element: el, callback: handler });
    });
  }

  _loadCharts() {
    // Cek apakah Chart.js sudah dimuat
    if (typeof Chart !== "undefined") {
      this._initCharts();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/chart.js";
    script.onload = () => this._initCharts();
    document.head.appendChild(script);
  }

  _initCharts() {
    // Delay kecil untuk memastikan DOM siap
    setTimeout(() => {
      this._initFinancialChart();
      this._initGrowthChart();
    }, 100);
  }

  _initFinancialChart() {
    const ctx = document.getElementById("financialChart")?.getContext("2d");
    if (!ctx || this.financialChart) return;

    this.financialChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"],
        datasets: [
          {
            label: "2020",
            data: [30, 25, 40, 20, 35, 45, 20, 50, 30, 40, 35, 45],
            borderColor: "#3b82f6",
            backgroundColor: "rgba(59, 130, 246, 0.25)",
            fill: true,
            tension: 0.4,
          },
          {
            label: "2021",
            data: [40, 35, 60, 90, 45, 80, 95, 70, 60, 65, 75, 85],
            borderColor: "#ef4444",
            backgroundColor: "rgba(239, 68, 68, 0.25)",
            fill: true,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 1800,
          easing: "easeInOutCubic",
        },
        plugins: {
          legend: { display: true },
          tooltip: { mode: "index", intersect: false },
        },
        scales: {
          y: { beginAtZero: true, grid: { color: "#e5e7eb" } },
          x: { grid: { display: false } },
        },
      },
    });
  }

  _initGrowthChart() {
    const ctx = document.getElementById("growthChart")?.getContext("2d");
    if (!ctx || this.growthChart) return;

    this.growthChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Bulan Lalu", "Bulan Ini"],
        datasets: [
          {
            label: "Keuntungan (Rp)",
            data: [3800000, 4750000],
            backgroundColor: ["#FFD2D2", "#4f46e5"],
            borderRadius: 8,
            borderSkipped: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 1200,
          easing: "easeOutBounce",
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 5000000,
            ticks: {
              callback: (v) => "Rp" + v.toLocaleString("id-ID"),
            },
            grid: { color: "rgba(0,0,0,0.05)" },
          },
          x: { grid: { display: false } },
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => "Rp" + ctx.raw.toLocaleString("id-ID"),
            },
          },
        },
      },
    });
  }
}
import '../../components/HeaderComponent.js';
import DashboardPresenter from './Dashboard-presenter.js';
import initGlobalScrollAnimation from '../../components/scroll-animation.js';

export default class Dashboard {
  constructor() {
    this.presenter = new DashboardPresenter(this);
    this.financialChart = null;
    this.growthChart = null;
  }

 async render() {
  return `
    <div class="main-content-wrapper scroll-animate">
      <section class="quick-actions-row scroll-animate">
        <div class="quick-action-card gradient-sewa scroll-animate" data-href="#/sewa">
          <div class="card-title">
            <img src="/logo/sewa-white.png" alt="Sewa" class="card-icon" />
            <h3>Sewa</h3>
          </div>
          <p>Lakukan proses pencatatan sewa barang disini</p>
          <span class="see-more"> Lihat Selengkapnya 
            <img src="/logo/panah.png" alt="Panah" class="arrow-icon" />
          </span>
        </div>

        <div class="quick-action-card gradient-stok scroll-animate" data-href="#/stok">
          <div class="card-title">
            <img src="/logo/stok-white.png" alt="Stok" class="card-icon" />
            <h3>Stok</h3>
          </div>
          <p>Manajemen stok barang sewa</p>
          <span class="see-more"> Lihat Selengkapnya 
            <img src="/logo/panah.png" alt="Panah" class="arrow-icon" />
          </span>
        </div>

        <div class="quick-action-card gradient-laporan scroll-animate" data-href="#/laporanKeuangan">
          <div class="card-title">
            <img src="/logo/laporan-white.png" alt="Laporan" class="card-icon" />
            <h3>Laporan Keuangan</h3>
          </div>
          <p>Lihat laporan keuangan disini</p>
          <span class="see-more"> Lihat Selengkapnya 
            <img src="/logo/panah.png" alt="Panah" class="arrow-icon" />
          </span>
        </div>
      </section>

      <div class="content-layout scroll-animate">
        <div class="primary-content scroll-animate">
          <section class="analytics-section scroll-animate" data-href="#/laporanKeuangan">
            <h2>Analisis Keuangan</h2>
            <div class="financial-grid scroll-animate">
              <div class="financial-stats scroll-animate">
                <div class="stat-item">
                  <span>Keuntungan bulan ini</span>
                  <strong>Rp17.800.000</strong>
                </div>
                <div class="stat-item">
                  <span>Prediksi keuntungan bulan depan</span>
                  <strong>Rp18.500.000</strong>
                </div>
                <button class="btn-see-more">Lihat Selengkapnya 
                  <img src="/logo/panah.png" alt="Panah" class="arrow-icon" />
                </button>
              </div>
              <div class="financial-chart scroll-animate">
                <canvas id="financialChart"></canvas>
              </div>
            </div>
          </section>

          <section class="stats-grid scroll-animate">
            <div class="stat-card scroll-animate">
              <div class="stat-title">Jumlah Stok Barang</div>
              <div class="stat-values">
                <div>
                  <div class="stat-value">38</div>
                  <div class="stat-sub">Baju Karnaval</div>
                </div>
                <div>
                  <div class="stat-value">20</div>
                  <div class="stat-sub">Baju Designer</div>
                </div>
              </div>
            </div>

            <div class="stat-card scroll-animate">
              <div class="stat-title">Jumlah Sewa</div>
              <div class="stat-value">38</div>
              <div class="stat-sub">Barang Disewa</div>
            </div>

            <div class="stat-card scroll-animate">
              <div class="stat-title">Jumlah Kembali</div>
              <div class="stat-value">10</div>
              <div class="stat-sub">Barang Kembali</div>
            </div>
          </section>
        </div>

        <aside class="dashboard-sidebar scroll-animate">
          <div class="sidebar-card growth-chart scroll-animate">
            <h2>Grafik Pertumbuhan Keuangan</h2>
            <div class="chart-placeholder scroll-animate">
              <canvas id="growthChart"></canvas>
            </div>
            <div class="legend scroll-animate">
              <span><i style="background: #FFD2D2;"></i> Bulan Lalu</span>
              <span><i style="background: #4f46e5;"></i> Bulan Ini</span>
            </div>
            <div class="growth-summary scroll-animate">
              <div class="summary-title">Pertumbuhan Keuntungan Bulan Ini</div>
              <div class="summary-info">
                <div class="summary-value">Rp150.000</div>
                <div class="trend-icon">
                  <img src="/logo/arrow.png" alt="Trend Naik" class="arrow-up" />
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  `;
}


  async afterRender() {
    await this.presenter.injectContent();
    this.presenter.bindNavEvents();


    // Pastikan Chart.js sudah ada
    if (typeof Chart === "undefined") {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/chart.js";
      script.onload = () => this._initCharts();
      document.head.appendChild(script);
    } else {
      this._initCharts();
    }

    initGlobalScrollAnimation();
    
  }

  _initCharts() {
    // Delay kecil agar DOM layout stabil
    setTimeout(() => {
      this._initFinancialChart();
      this._initGrowthChart();
    }, 150);
  }

_initFinancialChart() {
  const ctx = document.getElementById("financialChart")?.getContext("2d");
  if (!ctx) return;

  // 🎨 Gradasi lembut
  const gradientBlue = ctx.createLinearGradient(0, 0, 0, 400);
  gradientBlue.addColorStop(0, "rgba(59, 130, 246, 0.4)");
  gradientBlue.addColorStop(0.7, "rgba(59, 130, 246, 0.15)");
  gradientBlue.addColorStop(1, "rgba(59, 130, 246, 0)");

  const gradientRed = ctx.createLinearGradient(0, 0, 0, 400);
  gradientRed.addColorStop(0, "rgba(255, 221, 221, 0.4)");
  gradientRed.addColorStop(1, "rgba(243, 46, 46, 0.15)");

  this.financialChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: [
        "Jan","Feb","Mar","Apr","Mei","Jun",
        "Jul","Agu","Sep","Okt","Nov","Des"
      ],
      datasets: [
        {
          label: "2020",
          data: [30,25,40,20,35,45,20,50,30,40,35,45],
          borderColor: "#3b82f6",
          backgroundColor: gradientBlue,
          fill: true,
          tension: 0.4,
          borderWidth: 2,
          pointBackgroundColor: "#fff",
          pointBorderColor: "#3b82f6",
          pointRadius: 3.5,
        },
        {
          label: "2021",
          data: [40,35,60,90,45,80,95,70,60,65,75,85],
          borderColor: "#ff928a",
          backgroundColor: gradientRed,
          fill: true,
          tension: 0.4,
          borderWidth: 2,
          pointBackgroundColor: "#fff",
          pointBorderColor: "#ff928a",
          pointRadius: 3.5,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "bottom" },
      },
      scales: {
        y: { beginAtZero: true },
      },
      animation: {
        duration: 2000,
        easing: "easeOutQuart",

        // 🌊 Muncul dari bawah ke atas
        y: {
          type: "number",
          from: (ctx) => {
            // mulai dari dasar sumbu Y (bawah chart)
            const chart = ctx.chart;
            return chart.scales.y.getPixelForValue(0);
          },
          duration: 1500,
          easing: "easeOutCubic",
        },

        // 💫 Delay antar dataset → biru dulu, lalu oranye nyusul
        delay(ctx) {
          if (ctx.type !== "data" || ctx.mode !== "default") return 0;
          const datasetIndex = ctx.datasetIndex;
          const dataIndex = ctx.dataIndex;
          return datasetIndex * 1200 + dataIndex * 120;
        },
      },
    },
  });
}



_initGrowthChart() {
  const ctx = document.getElementById("growthChart")?.getContext("2d");
  if (!ctx) return;

  const staggerPlugin = {
    id: "staggerPlugin",
    beforeDatasetDraw(chart, args) {
      const progress = chart.$animationProgress ?? 0;
      const meta = args.meta;
      const delayStep = 0.15; // jeda antar batang (lebih cepat dari 0.25)

      meta.data.forEach((bar, i) => {
        // efek muncul halus (ease-in-out feeling)
        const delayProgress = Math.max(0, Math.min(1, (progress - i * delayStep) / (1 - delayStep)));
        const eased = delayProgress ** 1.5; // buat transisi lebih smooth
        bar.y = bar.base - (bar.base - bar.y) * eased;
      });
    },
  };

  this.growthChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Bulan Lalu", "Bulan Ini"],
      datasets: [
        {
          label: "Keuntungan (Rp)",
          data: [3800000, 4750000],
          backgroundColor: ["#FFD2D2", "#4f46e5"],
          borderRadius: 10,
          borderSkipped: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 1200, // ⚡ lebih cepat dari sebelumnya (1800 → 1200)
        easing: "easeOutBack", // lebih smooth & bounce lembut (daripada bounce keras)
        onProgress(animation) {
          this.$animationProgress = animation.currentStep / animation.numSteps;
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 5000000,
          ticks: {
            callback: (v) => "Rp" + v.toLocaleString("id-ID"),
          },
          grid: {
            color: "#eee",
          },
        },
        x: { grid: { display: false } },
      },
      plugins: {
        legend: { display: false },
      },
    },
    plugins: [staggerPlugin],
  });
}




  unmount() {
    this.presenter.cleanup();
    if (this.financialChart) this.financialChart.destroy();
    if (this.growthChart) this.growthChart.destroy();
  }
}

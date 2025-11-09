export default class DashboardPresenter {
  constructor(view) {
    this.view = view;
    this.financialChart = null;
    this.growthChart = null;
    this.navClickHandlers = [];
  }

  async injectContent() {
    const container = document.querySelector("#main-content");
    if (!container) return console.error("#main-content tidak ditemukan!");
    container.innerHTML = await this.view.render();
  }

  bindNavEvents() {
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

  loadCharts() {
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
    setTimeout(() => {
      this._initFinancialChart();
      this._initGrowthChart();
    }, 100);
  }

  _initFinancialChart() {
    const ctx = document.getElementById("financialChart")?.getContext("2d");
    if (!ctx || this.financialChart) return;

    const gradientBlue = ctx.createLinearGradient(0, 0, 0, 400);
    gradientBlue.addColorStop(0, "rgba(59, 130, 246, 0.4)");
    gradientBlue.addColorStop(0.7, "rgba(59, 130, 246, 0.15)");
    gradientBlue.addColorStop(1, "rgba(59, 130, 246, 0)");

    const gradientRed = ctx.createLinearGradient(0, 0, 0, 400);
    gradientRed.addColorStop(0, "rgba(255, 221, 221, 0.4)");
    gradientRed.addColorStop(1, "rgba(243, 46, 46, 0.15)");
    gradientRed.addColorStop(1, "rgba(239, 68, 68, 0)");

    this.financialChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"],
        datasets: [
          {
            label: "2020",
            data: [30,25,40,20,35,45,20,50,30,40,35,45],
            borderColor: "#8979ff",
            backgroundColor: gradientBlue,
            fill: true,
            tension: 0.35,
            borderWidth: 2,
            pointBackgroundColor: "#fff",
            pointBorderColor: "#8979ff",
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
          },
          {
            label: "2021",
            data: [40,35,60,90,45,80,95,70,60,65,75,85],
            borderColor: "#ff928a",
            backgroundColor: gradientRed,
            fill: true,
            tension: 0.35,
            borderWidth: 2,
            pointBackgroundColor: "#fff",
            pointBorderColor: "#ff928a",
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
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
          legend: {
            position: "bottom",
            labels: {
              usePointStyle: true,
              pointStyle: "circle",
              color: "#333",
              font: {
                size: 12,
                family: "Poppins",
              },
              padding: 20,
            },
          },
          tooltip: {
            mode: "index",
            intersect: false,
            backgroundColor: "rgba(255,255,255,0.9)",
            titleColor: "#111",
            bodyColor: "#111",
            borderColor: "#ddd",
            borderWidth: 1,
            titleFont: { weight: "bold" },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: "#e5e7eb" },
            ticks: {
              color: "#6b7280",
              font: { family: "Poppins" },
            },
          },
          x: {
            grid: { display: false },
            ticks: {
              color: "#6b7280",
              font: { family: "Poppins" },
            },
          },
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
        labels: ["Bulan Lalu","Bulan Ini"],
        datasets: [
          {
            label: "Keuntungan (Rp)",
            data: [3800000,4750000],
            backgroundColor: ["#FFD2D2","#4f46e5"],
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

  cleanup() {
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
}


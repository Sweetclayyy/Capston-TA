import '../../components/HeaderComponent.js';
import DashboardPresenter from './dashboard-presenter.js';

export default class Dashboard {
  constructor() {
    this.presenter = new DashboardPresenter(this);
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
            <span class="see-more"> Lihat Selengkapnya <img src="/logo/panah.png" alt="Panah" class="arrow-icon" /></span>
          </div>

          <div class="quick-action-card gradient-stok" data-href="#/stok">
            <div class="card-title">
              <img src="/logo/stok-white.png" alt="Stok" class="card-icon" />
              <h3>Stok</h3>
            </div>
            <p>Manajemen stok barang sewa</p>
            <span class="see-more"> Lihat Selengkapnya <img src="/logo/panah.png" alt="Panah" class="arrow-icon" /></span>
          </div>

          <div class="quick-action-card gradient-laporan" data-href="#/laporanKeuangan">
            <div class="card-title">
              <img src="/logo/laporan-white.png" alt="Laporan Keuangan" class="card-icon" />
              <h3>Laporan Keuangan</h3>
            </div>
            <p>Lihat laporan keuangan disini</p>
            <span class="see-more"> Lihat Selengkapnya <img src="/logo/panah.png" alt="Panah" class="arrow-icon" /></span>
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
                  <button class="btn-see-more">Lihat Selengkapnya <img src="/logo/panah.png" alt="Panah" class="arrow-icon" /></button>
                </div>
                <div class="financial-chart">
                  <canvas id="financialChart"></canvas>
                </div>
              </div>
            </section>

            <section class="stats-grid">
              <div class="stat-card">
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

              <div class="growth-summary">
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
    this.presenter.loadCharts();
  }

  unmount() {
    this.presenter.cleanup();
  }
}


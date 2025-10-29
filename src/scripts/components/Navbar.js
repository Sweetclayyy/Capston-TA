class NavbarComponent extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <style>
        .layout {
          display: flex;
          height: 100vh;
          font-family: 'Poppins', sans-serif;
          background-color: #f9fafb;
        }

        /* Sidebar */
        .sidebar {
          background-color: #1E3AFA;
          width: 230px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          border-top-right-radius: 30px;
          border-bottom-right-radius: 30px;
          color: white;
          padding: 20px 0;
        }

        .nav-menu {
          display: flex;
          flex-direction: column;
          gap: 5px;
          margin-top: 10px;
        }

        .nav-item {
          padding: 12px 25px;
          border-radius: 30px 0 0 30px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .nav-item:hover {
          background-color: rgba(255, 255, 255, 0.2);
        }

        .nav-item.active {
          background-color: white;
          color: #1E3AFA;
          font-weight: 600;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }

        .logout-btn {
          color: white;
          text-align: left;
          padding: 12px 25px;
          background: none;
          border: none;
          cursor: pointer;
          transition: background 0.3s;
        }

        .logout-btn:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        /* Navbar atas */
        .topbar {
          background: white;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 40px;
          border-bottom: 1px solid #e5e7eb;
          flex-shrink: 0;
        }

        .topbar h1 {
          font-size: 18px;
          font-weight: 600;
          color: #333;
        }

        .topbar .logout {
          color: #ff4444;
          cursor: pointer;
          font-weight: 500;
        }

        /* Konten */
        .content {
          flex: 1;
          padding: 30px;
          color: #333;
        }

        .fade {
          transition: opacity 0.4s ease;
          opacity: 1;
        }
      </style>

      <div class="layout">
        <aside class="sidebar">
          <div class="nav-menu">
            <div class="nav-item" data-route="/dashboard"> Dasbor</div>
            <div class="nav-item" data-route="/sewa"> Sewa</div>
            <div class="nav-item" data-route="/stok"> Stok</div>
            <div class="nav-item" data-route="/laporanKeuangan"> Laporan</div>
            <button class="logout-btn-blue" data-route="/logout"> Logout</button>
          </div>
          <button class="logout-btn">🚪 Logout</button>
        </aside>

        <main style="flex: 1; display: flex; flex-direction: column;">
          <header class="topbar">
            <h1 id="page-title">Dashboard</h1>
            <span class="logout">Logout</span>
          </header>

        </main>
      </div>
    `;

    const items = this.querySelectorAll(".nav-item");
    const title = this.querySelector("#page-title");
    const content = this.querySelector("#page-content");

    items.forEach((item) => {
      item.addEventListener("click", () => {
        items.forEach((i) => i.classList.remove("active"));
        item.classList.add("active");

        const page = item.dataset.page;
        title.textContent = page.charAt(0).toUpperCase() + page.slice(1);

        // Animasi transisi konten
        content.style.opacity = 0;
        setTimeout(() => {
          content.innerHTML = `
            <h2>Halaman ${page.charAt(0).toUpperCase() + page.slice(1)}</h2>
            <p>Konten untuk menu ${page} muncul di sini.</p>
          `;
          content.style.opacity = 1;
        }, 300);
      });
    });
  }
}

customElements.define("navbar-component", NavbarComponent);

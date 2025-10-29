class NavbarComponent extends HTMLElement {
  connectedCallback() {
    // Muat CSS hanya sekali
    if (!document.querySelector('link[href$="navigation-bar.css"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "../../styles/navigation-bar.css";
      document.head.appendChild(link);
    }

    // Template utama
    this.innerHTML = `
      <div class="layout">
        <aside class="sidebar">
          <div class="nav-menu">
            <div class="nav-item" data-route="/dashboard"> Dasbor</div>
            <div class="nav-item" data-route="/sewa"> Sewa</div>
            <div class="nav-item" data-route="/stok"> Stok</div>
            <div class="nav-item" data-route="/laporanKeuangan"> Laporan</div>
            <button class="logout-btn-blue" data-route="/logout"> Logout</button>
          </div>
        </aside>

        <main class="main-area">
          <header class="topbar">
            <h1 id="page-title">Dashboard</h1>
            <button class="logout-btn" data-route="/logout">🚪 Logout</button>
          </header>

        </main>
      </div>
    `;

    this.#initNavigation();
  }

  #initNavigation() {
    const items = this.querySelectorAll(".nav-item, .logout-btn");
    const title = this.querySelector("#page-title");
    const content = this.querySelector("#page-content");

    // Set menu aktif berdasarkan path saat ini
    const currentPath = window.location.hash.slice(1) || "/dashboard";
    this.#setActiveMenu(currentPath);

    items.forEach((item) => {
      item.addEventListener("click", () => {
        const route = item.dataset.route;
        if (!route) return;


        window.location.hash = route;


        this.#setActiveMenu(route);


        content.style.opacity = 0;
        setTimeout(() => {
          title.textContent =
            route === "/dashboard"
              ? "Dashboard"
              : route.slice(1).replace(/^\w/, (c) => c.toUpperCase());
          content.innerHTML = `
            <h2>Halaman ${title.textContent}</h2>
            <p>Konten untuk menu ${title.textContent} muncul di sini.</p>
          `;
          content.style.opacity = 1;
        }, 300);
      });
    });
  }

  #setActiveMenu(route) {
    const items = this.querySelectorAll(".nav-item, .logout-btn");
    items.forEach((i) =>
      i.dataset.route === route
        ? i.classList.add("active")
        : i.classList.remove("active")
    );
  }
}

customElements.define("navbar-component", NavbarComponent);

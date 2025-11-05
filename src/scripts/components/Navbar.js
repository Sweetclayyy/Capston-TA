class NavbarComponent extends HTMLElement {
  connectedCallback() {
    if (!document.querySelector('link[href$="navigation-bar.css"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "../../styles/navigation-bar.css";
      document.head.appendChild(link);
    }

    this.innerHTML = `
      <div class="layout">
        <aside class="sidebar">
          <div class="nav-menu">
            <div class="nav-item" data-route="/dashboard">
              <img src="/logo/dasboard-blue.png" alt="Dashboard" class="nav-icon" />
              <span>Dasbor</span>
            </div>
            <div class="nav-item" data-route="/sewa">
              <img src="/logo/sewa-blue.png" alt="Sewa" class="nav-icon" />
              <span>Sewa</span>
            </div>
            <div class="nav-item" data-route="/stok">
              <img src="/logo/stok-blue.png" alt="Stok" class="nav-icon" />
              <span>Stok</span>
            </div>
            <div class="nav-item" data-route="/laporanKeuangan">
              <img src="/logo/laporan-blue.png" alt="Laporan Keuangan" class="nav-icon" />
              <span>Laporan Keuangan</span>
            </div>
          </div>
          <button class="logout-btn" data-route="/logout">Logout</button>
        </aside>

        <main class="main-area">
          <header class="topbar">
            <h1 id="page-title">Dashboard</h1>
            <button class="logout-btn" data-route="/logout">Logout</button>
          </header>
          <div id="main-content"></div> <!-- 🔥 tempat halaman dirender -->
        </main>
      </div>
    `;

    this.#initNavigation();
  }

  #initNavigation() {
    const items = this.querySelectorAll(".nav-item, .logout-btn");
    const title = this.querySelector("#page-title");

    const updateTitle = (route) => {
      if (!title) return;
      let cleanTitle = route.replace("/", "");
      cleanTitle = cleanTitle.replace(/([a-z])([A-Z])/g, "$1 $2");
      cleanTitle = cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1);
      if (route === "/dashboard") cleanTitle = "Dashboard";
      title.textContent = cleanTitle;
    };

    const currentPath = window.location.hash.slice(1) || "/dashboard";
    this.#setActiveMenu(currentPath);
    updateTitle(currentPath);

    items.forEach((item) => {
      item.addEventListener("click", () => {
        const route = item.dataset.route;
        if (!route) return;
        window.location.hash = route;
        this.#setActiveMenu(route);
        updateTitle(route);
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

// src/components/NavbarComponent.js
class NavbarComponent extends HTMLElement {
  connectedCallback() {
    if (!document.querySelector('link[href$="navigation-bar.css"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "../../styles/navigation-bar.css";
      document.head.appendChild(link);
    }

    this.innerHTML = `
      <aside class="sidebar">
        <div class="nav-menu">
          <div class="nav-item" data-route="/dashboard" data-icon="dasbor">
            <img src="/logo/dasbor-blue.png" alt="Dashboard" class="nav-icon" />
            <span>Dasbor</span>
          </div>
          <div class="nav-item" data-route="/sewa" data-icon="sewa">
            <img src="/logo/sewa-white.png" alt="Sewa" class="nav-icon" />
            <span>Sewa</span>
          </div>
          <div class="nav-item" data-route="/stok" data-icon="stok">
            <img src="/logo/stok-white.png" alt="Stok" class="nav-icon" />
            <span>Stok</span>
          </div>
          <div class="nav-item" data-route="/laporanKeuangan" data-icon="laporan">
            <img src="/logo/laporan-white.png" alt="Laporan Keuangan" class="nav-icon" />
            <span>Laporan Keuangan</span>
          </div>
        </div>

        <button class="logout-btn-blue" data-route="/logout">
          <img src="./logo/logout-white.png" alt="Logout Icon" class="logout-icon" />
          <span>Logout</span>
        </button>
      </aside>
      
    `;

    this.initNavigation();
  }

initNavigation() {
  const items = this.querySelectorAll(".nav-item, .logout-btn-blue");
  let currentPath = window.location.hash.replace("#", "");
  if (!currentPath || currentPath === "/") {
    currentPath = "/dashboard"; 
  }


  this.setActiveMenu(currentPath);
  document.dispatchEvent(new CustomEvent("route-changed", { detail: currentPath }));

  window.addEventListener("hashchange", () => {
    const newPath = window.location.hash.replace("#", "") || "/dashboard";
    this.setActiveMenu(newPath);
    document.dispatchEvent(new CustomEvent("route-changed", { detail: newPath }));
  });

  items.forEach((item) => {
    item.addEventListener("click", () => {
      const route = item.dataset.route;
      if (!route) return;
      window.location.hash = route;
    });
  });
}



  setActiveMenu(route) {
    const items = this.querySelectorAll(".nav-item");
    items.forEach((item) => {
      const iconBase = item.dataset.icon;
      const img = item.querySelector(".nav-icon");
      if (item.dataset.route === route) {
        item.classList.add("active");
        img.src = `/logo/${iconBase}-blue.png`;
      } else {
        item.classList.remove("active");
        img.src = `/logo/${iconBase}-white.png`;
      }
    });
  }
}

customElements.define("navbar-component", NavbarComponent);

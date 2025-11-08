// src/components/HeaderComponent.js
class HeaderComponent extends HTMLElement {
  connectedCallback() {
    if (!document.querySelector('link[href$="header.css"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "../../styles/header.css";
      document.head.appendChild(link);
    }

this.innerHTML = `
  <header class="topbar">
    <h1 id="page-title">Dashboard</h1>
    <div class="topbar-right">
      <button class="logout-btn" data-route="/logout">
        <img src="/logo/logout-red.png" alt="Logout" class="logout-icon" />
        <span>Logout</span>
      </button>
      <img src="/logo/avatar.png" alt="Avatar" class="avatar-icon" />
    </div>
  </header>
`;


    this._listenToRouteChange();
  }

  _listenToRouteChange() {
    document.addEventListener("route-changed", (event) => {
      const route = event.detail;
      const title = this.querySelector("#page-title");
      let cleanTitle = route.replace("/", "");
      cleanTitle = cleanTitle.replace(/([a-z])([A-Z])/g, "$1 $2");
      cleanTitle = cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1);
      if (route === "/dashboard") cleanTitle = "Dashboard";
      title.textContent = cleanTitle;
    });
  }
}

customElements.define("header-component", HeaderComponent);

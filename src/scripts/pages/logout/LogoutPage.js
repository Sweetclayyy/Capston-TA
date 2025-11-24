import authService from "../../data/auth-service.js";

export default class Logout {
  async render() {
    return `
      <section class="container">
        <div class="logout-container">
          <h1>Logging Out...</h1>
          <div class="loader"></div>
        </div>
      </section>
    `;
  }

  showToast(message) {
    const existingToast = document.querySelector(".toast");
    if (existingToast) existingToast.remove();

    const overlay = document.createElement("div");
    overlay.className = "toast-overlay";

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `
      <div class="checkmark-wrapper">
        <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
          <circle class="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
          <path class="checkmark-check" fill="none" d="M14 27l7 7 16-16" />
        </svg>
      </div>
      <span class="toast-text">${message}</span>
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(toast);

    setTimeout(() => {
      overlay.classList.add("show");
      toast.classList.add("show");
    }, 50);

    setTimeout(() => {
      overlay.classList.remove("show");
      toast.classList.remove("show");
      setTimeout(() => {
        overlay.remove();
        toast.remove();
      }, 400);
    }, 2800);
  }

  async afterRender() {
    this.showToast("Sedang logout...");

    try {
      console.log("Logging out user...");
      await authService.logout();

      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_name");

      console.log("Logout successful, redirecting...");

      this.showToast("Logout berhasil!");

      setTimeout(() => {
        window.location.hash = "#/login";
      }, 2000);

    } catch (error) {
      console.error("Logout error:", error);

      this.showToast("Logout gagal, dialihkan ke login...");

      setTimeout(() => {
        window.location.hash = "#/login";
      }, 2000);
    }
  }
}

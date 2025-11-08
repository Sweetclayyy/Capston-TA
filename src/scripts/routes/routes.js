// router.js (ganti nama file jadi ini lebih jelas)
import Login from "../pages/login/LoginPage.js";
import LandingPresenter from "../pages/landing-page/LandingPage-Presenter.js";
import Logout from "../pages/logout/LogoutPage.js";
import Dashboard from "../pages/dashboard/Dashboard-page.js";
import LaporanPage from "../pages/laporanKeuangan/LaporanKeuanganPage.js";
import StokPage from "../pages/stok/StokPage.js";
import ProfilePage from "../pages/profile/profile-page.js";
import SewaPage from "../pages/penyewaan/SewaPage.js";
import SewaForm from "../pages/penyewaan/SewaForm.js";

let currentPage = null;
const mainContent = document.querySelector("#main-content");

if (!mainContent) {
  console.error("❌ #main-content tidak ditemukan di DOM!");
}

function createPage(path) {
  switch (path) {
    case "/login":
      return new Login();
    case "/landing":
      return new LandingPresenter(mainContent);
    case "/dashboard":
      return new Dashboard();
    case "/logout":
      return new Logout();
    case "/laporanKeuangan":
      return new LaporanPage();
    case "/stok":
      return new StokPage();
    case "/profile":
      return new ProfilePage();
    case "/sewa":
      return new SewaPage();
    case "/sewaForm":
      return new SewaForm();
    default:
      return null;
  }
}

export function navigateTo(path) {
  // 🔴 1. Unmount halaman sebelumnya jika ada
  if (currentPage && typeof currentPage.unmount === "function") {
    currentPage.unmount();
  }

  // 🟢 2. Redirect root ke /landing
  if (path === "/") {
    window.history.replaceState(null, "", "/landing");
    path = "/landing";
  }

  // 🟢 3. Buat halaman baru
  let page = createPage(path);

  if (!page) {
    console.error(`PageRoute not found: ${path}`);
    return;
  }

  // 🟢 4. Simpan sebagai halaman aktif
  currentPage = page;

  // 🟢 5. Render halaman
  if (typeof page.afterRender === "function") {
    page.afterRender();
  } else if (typeof page.render === "function") {
    // fallback untuk halaman sederhana
    mainContent.innerHTML = page.render();
  }
}

// 🔄 Tangani perubahan hash
window.addEventListener("hashchange", () => {
  const hash = window.location.hash.slice(1) || "/";
  navigateTo(hash);
});

// 🔁 Load halaman pertama saat app start
document.addEventListener("DOMContentLoaded", () => {
  const initialHash = window.location.hash.slice(1) || "/";
  navigateTo(initialHash);
});
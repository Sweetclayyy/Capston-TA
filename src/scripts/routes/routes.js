import Login from "../pages/login/LoginPage.js";
import LandingPresenter from "../pages/landing-page/LandingPage-Presenter.js";
import Logout from "../pages/logout/LogoutPage.js";
import Dashboard from "../pages/dashboard/Dashboard-page.js";
import LaporanPage from "../pages/laporanKeuangan/LaporanKeuanganPage.js";
import StokPage from "../pages/stok/StokPage.js";
import ProfilePage from "../pages/profile/profile-page.js";
import SewaPage from "../pages/penyewaan/SewaPage.js";
import SewaForm from "../pages/penyewaan/SewaForm.js";


const getRoutes = (mainContent) => {
  return {
    "/login": new Login(),
    "/landing": new LandingPresenter(mainContent),
    "/dashboard": new Dashboard(),
    "/logout": new Logout(),
    "/laporanKeuangan": new LaporanPage(),
    "/stok": new StokPage(),
    "/profile": new ProfilePage(),
    "/sewa": new SewaPage(),
    "/sewaForm": new SewaForm(),

    "/": {
      render: () => {
        window.location.hash = "/landing";
        return "<div>Redirecting...</div>";
      },
    },
  };
};

export default getRoutes;

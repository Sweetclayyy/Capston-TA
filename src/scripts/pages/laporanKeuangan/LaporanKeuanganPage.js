import "../../components/Navbar.js";
export default class LaporanPage {
  constructor() {
  }

  async render() {
    return `
      <section class="container">
        <navbar-component></navbar-component>
      </section>
    `;
  }

  async afterRender() {
  }
}

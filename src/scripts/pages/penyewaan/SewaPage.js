import "../../components/Navbar.js";
export default class SewaPage {
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

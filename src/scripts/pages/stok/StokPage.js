import "../../components/Navbar.js";
export default class StokPage {
  async render() {
    return `
      <section class="container">
      <navbar-component></navbar-component>
      </section>
    `;
  }

  async afterRender() {
    // Do your job here
  }
}
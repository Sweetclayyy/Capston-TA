import "../../components/Navbar.js";

export default class Dashboard {
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

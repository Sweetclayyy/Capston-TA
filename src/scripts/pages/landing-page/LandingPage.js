export class LandingPage {
  constructor(container) {
    this.container = container;
  }

  async render(services) {
    const serviceItems = Array.isArray(services) ? services : [];

    return `
      <section class="container">
        <h1>Landing Page</h1>
      </section>
    `;
  }

  async afterRender() {
  }

}

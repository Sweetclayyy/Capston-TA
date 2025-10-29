import { LandingPage } from "./LandingPage";

export default class LandingPresenter {
  constructor(container) {
    this.container = container;
    this.services = [];
  }

  async render() {
    try {
      console.log(
        "LandingPresenter render called, container:",
        this.container ? "exists" : "missing"
      );
      const view = new LandingPage(this.container);
      const html = await view.render(this.services);
      return html;
    } catch (error) {
      console.error("Error in LandingPresenter render:", error);
      return `<div class="error-container">
        <h2>Error Loading Landing Page</h2>
        <p>${error.message}</p>
      </div>`;
    }
  }

  async afterRender() {
    console.log("LandingPresenter afterRender called");

    try {
      console.log("Creating LandingPage view instance");
      const view = new Dashboard(this.container);
      console.log("Calling view.afterRender()");
      await view.afterRender();
      console.log("View afterRender completed");
    } catch (error) {
      console.error("Error in LandingPresenter afterRender:", error);
    }
  }
}

import AbstractView from '../framework/view/abstract-view.js';

function createTopFrameTemplate (data) {
  return `
  <section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
    <!--  <h1 class="trip-info__title">Amsterdam &mdash; Chamonix &mdash; Geneva</h1> -->

    <!--  <p class="trip-info__dates">18&nbsp;&mdash;&nbsp;20 Mar</p> -->
    </div>

    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${data.cost}</span>
    </p>
  </section>`;
}

export default class TopFrame extends AbstractView {
  #info = null;

  constructor({ info }) {
    super();
    this.#info = info;
  }

  get template() {
    return createTopFrameTemplate(this.#info);
  }
}

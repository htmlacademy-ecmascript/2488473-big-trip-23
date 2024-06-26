import AbstractView from '../framework/view/abstract-view';

function createDestinationTemplate(legend) {
  if (legend !== '') {
    return (`
      <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${legend}</p>
      </section>
    `);
  } else {
    return '<div></div>';
  }
}

export default class DestinationView extends AbstractView {
  #legend = null;

  constructor(legend) {
    super();
    this.#legend = legend;
  }

  get template () {
    return createDestinationTemplate(this.#legend);
  }
}

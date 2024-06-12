import AbstractView from '../framework/view/abstract-view';

function createOffersTemplate(selected, all) {
  if (all[0].offers.length > 0) {
    let resultTemplate = '';

    all[0].offers.forEach((item) => {
      const title = item.title;
      const price = item.price;
      const id = item.id;

      resultTemplate += `
        <div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="event-offer-${title}-1" type="checkbox" name="event-offer-${title}" ${selected.includes(id) ? 'checked' : '' } data-id=${id}>
          <label class="event__offer-label" for="event-offer-${title}-1">
            <span class="event__offer-title">${title}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${price}</span>
          </label>
        </div>
      `;
    });

    return (`
      <section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>
        <div class="event__available-offers">
          ${resultTemplate}
        </div>
      </section>
    `);
  } else {
    return '<div></div>';
  }
}

export default class OffersView extends AbstractView {
  #selected = null;
  #typedAll = null;

  constructor(selected, typedAll) {
    super();
    this.#selected = selected;
    this.#typedAll = typedAll;
  }

  get template () {
    return createOffersTemplate(this.#selected, this.#typedAll);
  }
}

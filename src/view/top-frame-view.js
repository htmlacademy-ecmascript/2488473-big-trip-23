import dayjs from 'dayjs';
import AbstractView from '../framework/view/abstract-view.js';

const FORMAT = 'DD MMM';

function createTopFrameTemplate (cost, dates) {

  const firstDate = dayjs(dates.dateFrom[0]).format(FORMAT);
  const lastDate = dayjs(dates.dateTo[dates.dateTo.length - 1]).format(FORMAT);

  return `
  <section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
    <h1 class="trip-info__title"></h1>

    <p class="trip-info__dates">${firstDate} - ${lastDate}</p>
    </div>

    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${cost}</span>
    </p>
  </section>`;
}

export default class TopFrame extends AbstractView {
  #cost = null;
  #datesTo = null;
  #datesFrom = null;

  constructor({ allRoutes }) {
    super();
    this.allRoutes = allRoutes;
    this.#cost = allRoutes.reduce((currentSum, item) => currentSum + item.basePrice, 0);
    this.#datesTo = this.#unpackDate(allRoutes, 'dateTo');
    this.#datesFrom = this.#unpackDate(allRoutes, 'dateFrom');
  }

  #unpackDate (allRoutes, type) {
    return allRoutes.map((item) => item[type]);
  }

  get template() {
    return createTopFrameTemplate(this.#cost, {
      dateFrom: this.#datesFrom,
      dateTo: this.#datesTo
    });
  }
}

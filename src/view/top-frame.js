import dayjs from 'dayjs';
import AbstractView from '../framework/view/abstract-view.js';

function createTopFrameTemplate (cost, destination, dates) {

  const format = 'DD MMM';
  const firstDate = dayjs(dates.dateFrom[0]).format(format);
  const lastDate = dayjs(dates.dateTo[dates.dateTo.length - 1]).format(format);

  let formattedTitle = '';

  if (destination.length > 2) {
    formattedTitle = `${destination[0]} - ... - ${destination[destination.length - 1]}`;
  } else if (destination.length > 1) {
    formattedTitle = `${destination[0]} - ${destination[1]}`;
  } else {
    formattedTitle = 'Точек нету :(';
  }

  return `
  <section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
    <h1 class="trip-info__title">${formattedTitle}</h1>

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
  #destionation = null;

  constructor({ allRoutes, allDestanation }) {
    super();
    this.#cost = allRoutes.reduce((currentSum, item) => currentSum + item.basePrice, 0);
    this.#destionation = allDestanation.map((item) => item.name);
    this.#datesTo = this.#unpackDate(allRoutes, 'dateTo');
    this.#datesFrom = this.#unpackDate(allRoutes, 'dateFrom');
  }

  #unpackDate (allRoutes, type) {
    return allRoutes.map((item) => item[type]);
  }

  get template() {
    return createTopFrameTemplate(this.#cost, this.#destionation, {
      dateFrom: this.#datesFrom,
      dateTo: this.#datesTo
    });
  }
}

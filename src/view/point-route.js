import { createElement } from '../render.js';
import timeFormat from '../consts.js';
import dayjs from 'dayjs';

function createRouteOffersTemplate(data) {
  let resultTemplate = '';

  for (let i = 0; i < data.offers.length; i++) {
    resultTemplate += `
      <li class="event__offer">
        <span class="event__offer-title">${data.offers[i].title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${data.offers[i].price}</span>
      </li>
    `;
  }

  return resultTemplate;
}

function createRouteTemplate(data) {

  const dataFrom = dayjs(data.dateFrom);
  const dataTo = dayjs(data.dateTo);
  const dataCalculate = dataTo.subtract(dataFrom.hour(), 'hours').subtract(dataFrom.minute(), 'minutes');
  const dataDayColumn = dayjs(data.dateFrom).format('MMM DD').toUpperCase();
  const eventTitle = `${data.type.charAt(0).toUpperCase() + data.type.slice(1)} ${data.name.charAt(0).toUpperCase() + data.name.slice(1)}`;

  return `
  <li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime="2019-03-18">${dataDayColumn}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${data.type}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${eventTitle}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="2019-03-18T14:30">${dataFrom.format(timeFormat)}</time>
          &mdash;
          <time class="event__end-time" datetime="2019-03-18T16:05">${dataTo.format(timeFormat)}</time>
        </p>
        <p class="event__duration">${dataCalculate.hour()}H ${dataCalculate.minute()}M</p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${data.basePrice}</span>
      </p>
      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
        ${createRouteOffersTemplate(data)}
      </ul>
      <button class="event__favorite-btn  ${data.isFavorite ? 'event__favorite-btn--active' : ''}" type="button">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>
  `;
}

export default class RouteView {
  constructor({ route }) {
    this.route = route;
  }

  getTemplate() {
    return createRouteTemplate(this.route);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}

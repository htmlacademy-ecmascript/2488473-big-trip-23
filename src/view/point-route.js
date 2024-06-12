import AbstractView from '../framework/view/abstract-view.js';
import timeFormat, { timeFormatView } from '../consts.js';
import duration from 'dayjs/plugin/duration.js';
import dayjs from 'dayjs';
import { getDateDiff } from '../utils.js';

dayjs.extend(duration);

function insertCorrectTimeFormatted (dateFrom, dateTo) {
  const date = dayjs.duration(getDateDiff(dateFrom, dateTo));
  if (date.days()) {
    return date.format(timeFormatView.dayly);
  }

  if (date.hours()) {
    return date.format(timeFormatView.hourly);
  }

  return date.format(timeFormatView.minutly);
}

function createRouteOffersTemplate(selected, all) {
  let resultTemplate = '';

  for (let i = 0; i < all.offers.length; i++) {
    if (selected.includes(all.offers[i].id)) {
      resultTemplate += `
        <li class="event__offer">
          <span class="event__offer-title">${all.offers[i].title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${all.offers[i].price}</span>
        </li>
      `;
    }
  }

  return resultTemplate;
}

function createRouteTemplate(data, allOffers) {

  const dataFrom = dayjs(data.dateFrom);
  const dataTo = dayjs(data.dateTo);
  const dataDayColumn = dayjs(data.dateFrom).format('MMM DD').toUpperCase();
  const eventTitle = `${data.type} ${data.destination}`;

  return `
  <li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime="2019-03-18">${dataDayColumn}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${data.type}.png" alt="Event type icon">
      </div>
      <h3 class="event__title upcs">${eventTitle}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="2019-03-18T14:30">${dataFrom.format(timeFormat)}</time>
          &mdash;
          <time class="event__end-time" datetime="2019-03-18T16:05">${dataTo.format(timeFormat)}</time>
        </p>
        <p class="event__duration">${insertCorrectTimeFormatted(dataFrom, dataTo)}</p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${data.basePrice}</span>
      </p>
      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
        ${createRouteOffersTemplate(data.offers, allOffers)}
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

export default class RouteView extends AbstractView {
  #route = null;
  #allOffers = null;

  constructor(route, allOffers) {
    super();
    this.#route = route;
    this.#allOffers = allOffers[0];
  }

  get template() {
    return createRouteTemplate(this.#route, this.#allOffers);
  }
}

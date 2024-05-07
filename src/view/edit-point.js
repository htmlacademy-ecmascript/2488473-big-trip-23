import { makeFirstUppercase } from '../utils.js';
import AbstractView from '../framework/view/abstract-view.js';
import { eventTypes, offerTypes } from '../consts.js';
import dayjs from 'dayjs';

function createEventTypeTemplate(selectedType = '') {
  let result = '';

  for (let i = 0; i < eventTypes.length; i++) {
    result += `
    <div class="event__type-item">
      <input id="event-type-${eventTypes[i]}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${eventTypes[i]}" ${eventTypes[i] === selectedType ? 'checked' : ''}>
      <label class="event__type-label  event__type-label--${eventTypes[i]}" for="event-type-${eventTypes[i]}-1">${makeFirstUppercase(eventTypes[i])}</label>
    </div>
    `;
  }

  return result;
}

function createOfferTypeTemplate(offers = []) {
  let result = '';
  const selectedOffers = [];

  offers.forEach((item) => selectedOffers.push(item.title));

  for (let i = 0; i < offerTypes.length; i++) {

    const offerName = Object.keys(offerTypes[i])[0];
    const offerDesc = offerTypes[i][Object.keys(offerTypes[i])[0]];
    const offerPrice = offerTypes[i].price;

    result += `
    <div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offerName}-1" type="checkbox" name="event-offer-${offerName}" ${selectedOffers.includes(offerDesc) ? 'checked' : ''}>
      <label class="event__offer-label" for="event-offer-${offerName}-1">
        <span class="event__offer-title">${offerDesc}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offerPrice}</span>
      </label>
    </div>
    `;
  }

  return result;
}

function createEditTemplate(data) {

  const dataFrom = dayjs(data.dateFrom).format('DD/MM/YY HH:MM');
  const dataTo = dayjs(data.dateTo).format('DD/MM/YY HH:MM');

  return `
  <li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${data.type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${createEventTypeTemplate(data.type)}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${makeFirstUppercase(data.type)}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${data.name}" list="destination-list-1">
          <datalist id="destination-list-1">
            <option value="Amsterdam"></option>
            <option value="Geneva"></option>
            <option value="Chamonix"></option>
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dataFrom}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dataTo}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${data.basePrice}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>

          <div class="event__available-offers">
            ${createOfferTypeTemplate(data.offers)}
          </div>
        </section>

        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${data.description}</p>
        </section>
      </section>
    </form>
  </li>`;
}

export default class EditView extends AbstractView {
  constructor ({routesEdit}) {
    super();
    this.routesEdit = routesEdit;
  }

  get template () {
    return createEditTemplate(this.routesEdit);
  }
}

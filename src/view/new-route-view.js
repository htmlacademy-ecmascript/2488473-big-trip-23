import AbstractView from '../framework/view/abstract-view.js';
import { isEscape } from '../utils.js';
import flatpickr from 'flatpickr';

function createNewCardTemplate() {
  return (`
  <li class="trip-events__item trip-events__item-new">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/flight.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>

              <div class="event__type-item">
                <input id="event-type-taxi-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="taxi">
                <label class="event__type-label  event__type-label--taxi" for="event-type-taxi-1">Taxi</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-bus-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="bus">
                <label class="event__type-label  event__type-label--bus" for="event-type-bus-1">Bus</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-train-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="train">
                <label class="event__type-label  event__type-label--train" for="event-type-train-1">Train</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-ship-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="ship">
                <label class="event__type-label  event__type-label--ship" for="event-type-ship-1">Ship</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-drive-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="drive">
                <label class="event__type-label  event__type-label--drive" for="event-type-drive-1">Drive</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-flight-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="flight" checked>
                <label class="event__type-label  event__type-label--flight" for="event-type-flight-1">Flight</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-check-in-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="check-in">
                <label class="event__type-label  event__type-label--check-in" for="event-type-check-in-1">Check-in</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-sightseeing-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="sightseeing">
                <label class="event__type-label  event__type-label--sightseeing" for="event-type-sightseeing-1">Sightseeing</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-restaurant-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="restaurant">
                <label class="event__type-label  event__type-label--restaurant" for="event-type-restaurant-1">Restaurant</label>
              </div>
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">Flight</label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="Geneva" list="destination-list-1">
          <datalist id="destination-list-1"></datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="19/03/19 00:00">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="19/03/19 00:00">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="number" min="0" name="event-price" value="">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Cancel</button>
      </header>
      <section class="event__details"></section>
    </form>
  </li>`
  );
}

export default class NewRouteView extends AbstractView {
  #offers = null;
  #offersView = null;

  constructor (offers) {
    super();
    this.#offers = offers;
  }

  get template () {
    return createNewCardTemplate();
  }

  documentKeydownHandler = (evt) => {
    if (isEscape(evt)) {
      this.resetBtnClickHandler();
    }
  };

  resetBtnClickHandler = () => {
    document.querySelector('.trip-events__item-new').querySelector('.event__details').innerHTML = '';
    document.querySelector('.trip-events__item-new').remove();
    document.removeEventListener('keydown', this.documentKeydownHandler);
    document.querySelector('.trip-main__event-add-btn').disabled = !document.querySelector('.trip-main__event-add-btn').disabled;
  };

  init () {
    const elem = document.querySelector('.trip-events__item-new');
    const elemCostInput = elem.querySelector('#event-price-1');

    const elemDestinationInput = elem.querySelector('#event-destination-1');
    const elemDateStart = elem.querySelector('#event-start-time-1');
    const elemDateEnd = elem.querySelector('#event-end-time-1');

    [elemDestinationInput, elemDateStart, elemDateEnd].forEach((item) => {
      item.value = '';
    });

    document.querySelector('.trip-main__event-add-btn').disabled = !document.querySelector('.trip-main__event-add-btn').disabled;
    document.addEventListener('keydown', this.documentKeydownHandler);
    elem
      .querySelector('.event__reset-btn')
      .addEventListener('click', this.resetBtnClickHandler);

    elemCostInput.value = '0';

    elemCostInput.addEventListener('input', (evt) => {
      if (Number(evt.value) < 0) {
        evt.value = evt.value * -1;
      }
    });

    const dateFormat = 'd/m/y H:i';
    const enableTime = true;

    flatpickr(elem.querySelector('#event-start-time-1'),
      // eslint-disable-next-line camelcase
      { dateFormat, enableTime, time_24hr: true });

    flatpickr(elem.querySelector('#event-end-time-1'),
      // eslint-disable-next-line camelcase
      { dateFormat, enableTime, time_24hr: true });
  }
}

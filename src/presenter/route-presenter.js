import RouteView from '../view/route-view';
import EditView from '../view/edit-route-view';
import DestinationView from '../view/destination-legend-view';
import { render, replace } from '../framework/render';
import { isEscape, checkUpdate, getAllOffers } from '../utils';
import flatpickr from 'flatpickr';
import dayjs from 'dayjs';
import OffersView from '../view/offers-view';
import DestinationPhotoView from '../view/destination-photo-view';
import { editRoute, removeRoute } from '../model/task-api-getter';

export default class RoutePresenter {
  #container = document.querySelector('.trip-events__list');
  #patchFunc = null;
  #state = null;

  #uiBlocker = null;

  #offers = null;
  #destinations = null;

  #rollupClickCloseHandler = null;

  #route = null;

  #routeView = null;
  #editView = null;

  #offersView = null;
  #legendView = null;
  #photoView = null;

  constructor({ route, offers, destinations, closeAllRouteCb, patchFunc, uiBlocker }) {
    this.#patchFunc = patchFunc;
    this.#uiBlocker = uiBlocker;

    this.#offers = offers;
    this.#destinations = destinations;

    this.#rollupClickCloseHandler = closeAllRouteCb;

    this.#route = route;

    this.#routeView = new RouteView(this.#route, this.#offers
      .filter((el) => el.type === this.#route.type));
    this.#editView = new EditView(this.#route);
  }

  // -- SPEC -- [packs subscribers for fast use in (re)render component] //

  #routeViewPackSubscribe = () => {
    this.#favoriteRouteViewSubscribe();
    this.#openEditViewSubscribe();
    // ...more
  };

  #editViewSubscribe = () => {
    this.#openRouteViewSubscribe();
    // ...more
  };


  // -- LOGIC FUNC -- [main func for render] //

  #reRenderRouteView = () => {
    const newRouteView = new RouteView(this.#route, this.#offers.filter((el) => el.type === this.#route.type));

    replace(newRouteView, this.#routeView);
    this.#routeView = newRouteView;

    this.#routeViewPackSubscribe();
    this.#state = 'VIEW';
  };

  #initEditView = () => {
    const thisDestination = this.#destinations.filter((el) => el.name === this.#route.destination)[0] || '';

    const container = this.#editView.element
      .querySelector('.event__details');

    this.#initFlatpickr();
    this.#insertRealInfo();
    this.#initOffersChooserSubscribe(container);
    this.#initDestInfoChooserSubscribe(container, thisDestination);
    this.#initSaveBtn();
    this.#initDeleteBtn();
  };

  #rollupClickSwitchHandler = () => {
    replace(this.#editView, this.#routeView);
    this.#state = 'EDIT';

    this.#initEditView();
    this.#editViewSubscribe();
  };

  #switchEditToView = () => {
    this.#editView
      .element
      .querySelector('.event__details')
      .innerHTML = '';
    document.removeEventListener('keydown', this.#documentKeydownHandler);

    replace(this.#routeView, this.#editView);
    this.#state = 'VIEW';

    this.#routeViewPackSubscribe();
  };


  // -- MODEL EDIT -- [edit model] //

  #favoriteClickHandler = () => {
    this.#route.isFavorite = !this.#route.isFavorite;

    editRoute(this.#route.id, this.#route, this.#destinations)
      .then(() => {
        this.#patchFunc('PATCH', this.#route.id, this.#route);
        this.#reRenderRouteView();
      })
      .catch(() => {
        this.#routeView.shake();
        this.#route.isFavorite = !this.#route.isFavorite;
      });
  };


  // -- SUBSCRIBERS --  [work with DOM] //

  #favoriteRouteViewSubscribe = () => {
    this.#routeView
      .element
      .querySelector('.event__favorite-btn')
      .addEventListener('click', this.#favoriteClickHandler);
  };

  #openEditViewSubscribe = () => {
    const rollupBtn = this.#routeView.element.querySelector('.event__rollup-btn');

    rollupBtn.addEventListener('click', this.#rollupClickCloseHandler);
    rollupBtn.addEventListener('click', this.#rollupClickSwitchHandler);
  };

  #openRouteViewSubscribe = () => {
    this.#editView
      .element
      .querySelector('.event__rollup-btn')
      .addEventListener('click', () => this.#switchEditToView);

    document.addEventListener('keydown', this.#documentKeydownHandler);
  };

  #initFlatpickr = () => {
    flatpickr(this.#editView.element.querySelector('#event-start-time-1'),
      this.getDatepickerOptions('dateFrom'));

    flatpickr(this.#editView.element.querySelector('#event-end-time-1'),
      this.getDatepickerOptions('dateTo'));
  };

  #insertRealInfo = () => {
    this.#editView.element.querySelector('#event-price-1').value = this.#route.basePrice;
  };

  #initDestInfoChooserSubscribe = (container, thisDestination) => {

    this.#legendView = new DestinationView(thisDestination === '' ? '' : thisDestination.description);
    render(this.#legendView, container);

    this.#photoView = new DestinationPhotoView(thisDestination === '' ? [] : thisDestination.pictures);
    render(this.#photoView, container);

    const inputEventName = this.#editView.element.querySelector('#event-destination-1');

    const datalistContainer = this.#editView.element.querySelector('#destination-list-1');

    inputEventName.value = this.#route.destination;

    datalistContainer.innerHTML = '';
    this.#destinations.forEach((item) => {
      datalistContainer.innerHTML += `<option value='${item.name}'></option>`;
    });

    inputEventName.addEventListener('input', this.#getCorrectDestHandler(thisDestination));
  };

  #initOffersChooserSubscribe = (container) => {
    this.#offersView = new OffersView(this.#route.offers, this.#offers.filter((el) => el.type === this.#route.type));
    render(this.#offersView, container);

    const eventInFieldset = this.#editView.element.querySelector(`#event-type-${this.#route.type}-1`);
    const eventTypeToggler = this.#editView.element.querySelector('.event__type-toggle');
    const eventTypeText = this.#editView.element.querySelector('.event__type-output');
    const eventTypeIcon = this.#editView.element.querySelector('.event__type-icon');

    eventInFieldset.checked = true;
    eventTypeText.textContent = this.#route.type;
    eventTypeIcon.src = `img/icons/${this.#route.type}.png`;

    this.#editView
      .element
      .querySelectorAll('.event__type-input')
      .forEach((nodeElem) => {
        nodeElem.addEventListener('click', this.#handleClickEventType(eventTypeToggler, eventTypeText, eventTypeIcon));
      });
  };

  #initSaveBtn = () => {
    this.#editView.element
      .querySelector('.event__save-btn')
      .addEventListener('click', this.#saveBtnClickHandler);
  };

  #initDeleteBtn = () => {
    this.#editView.element
      .querySelector('.event__reset-btn')
      .addEventListener('click', this.#deleteBtnClickHandler);
  };

  // -- HANDLERS -- //

  #deleteBtnClickHandler = (evt) => {
    evt.preventDefault();
    evt.target.textContent = 'Deleting...';

    this.#uiBlocker.block();

    removeRoute(this.#route.id)
      .then((resp) => {
        if (resp.status === 204) {
          this.unMountComponent();
          this.#patchFunc('DELETE', this.#route.id);
        }
      })
      .catch(() => {
        evt.target.textContent = 'Delete';
        this.#editView.shake();
      });

    this.#uiBlocker.unblock();
  };

  #saveBtnClickHandler = (evt) => {
    evt.preventDefault();

    const newRoute = {
      basePrice: Number(this.#editView.element.querySelector('#event-price-1').value),
      dateFrom: dayjs(this.#editView.element.querySelector('#event-start-time-1')._flatpickr.selectedDates).toJSON(),
      dateTo: dayjs(this.#editView.element.querySelector('#event-end-time-1')._flatpickr.selectedDates).toJSON(),
      destination: this.#editView.element.querySelector('#event-destination-1').value,
      id: this.#route.id,
      isFavorite: this.#route.isFavorite,
      type: this.#editView.element.querySelector('.event__type-output').textContent,
      offers: getAllOffers(this.#editView.element.querySelectorAll('.event__offer-checkbox:checked'))
    };

    if (!checkUpdate(this.#route, newRoute)) {
      this.#uiBlocker.block();
      evt.target.textContent = 'Saving...';
      editRoute(this.#route.id, newRoute, this.#destinations)
        .then((resp) => {
          if (resp.ok) {
            this.#route = newRoute;
            this.#patchFunc('PATCH', this.#route.id, newRoute);
            this.#switchEditToView();
            this.#reRenderRouteView();
          }
        })
        .catch(() => {
          this.#editView.shake();
        });
      this.#uiBlocker.unblock();
      evt.target.textContent = 'Save';

    } else {
      this.#switchEditToView();
    }
  };

  #getCorrectDestHandler = (thisDestination) => (evt) => {
    thisDestination = this.#destinations.filter((el) => el.name === evt.target.value)[0];

    if (typeof thisDestination !== 'undefined') {
      const newLegendComponent = new DestinationView(thisDestination.description);
      replace(newLegendComponent, this.#legendView);
      this.#legendView = newLegendComponent;

      const newPhotoComponent = new DestinationPhotoView(thisDestination.pictures);
      replace(newPhotoComponent, this.#photoView);
      this.#photoView = newPhotoComponent;
    }
  };

  #handleClickEventType = (eventTypeToggler, eventTypeText, eventTypeIcon) => (evt) => {
    eventTypeToggler.checked = false;

    eventTypeText.textContent = evt.target.value;
    eventTypeIcon.src = `img/icons/${evt.target.value}.png`;

    const newOffersComponent = new OffersView([], this.#offers.filter((el) => el.type === evt.target.value));
    replace(newOffersComponent, this.#offersView);
    this.#offersView = newOffersComponent;
  };

  #documentKeydownHandler = (evt) => {
    if (isEscape(evt)) {
      this.#switchEditToView();
    }
  };


  // -- INIT (-S) -- //

  render = () => {
    render(this.#routeView, this.#container);
    this.#state = 'VIEW';

    this.#routeViewPackSubscribe();
  };


  // -- MISC -- [init of lib and get options] //

  unMountComponent = () => {
    if (this.#state === 'EDIT') {
      this.#switchEditToView();
    }

    this.#routeView.element.remove();
  };

  getDatepickerOptions = (type) => ({
    defaultDate: this.#route[type],
    enableTime: true,
    // eslint-disable-next-line camelcase
    time_24hr: true,
    dateFormat: 'd/m/y H:i'
  });

  // -- PUBLIC -- //

  closeThisRoute = () => {
    if (this.#state === 'EDIT') {
      this.#switchEditToView();
    }
  };
}

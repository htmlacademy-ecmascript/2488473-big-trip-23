import RouteView from '../view/point-route';
import EditView from '../view/edit-point';
import { render, replace } from '../framework/render';
import { isEscape } from '../utils';
import flatpickr from 'flatpickr';

export default class RoutePresenter {
  #route = null;
  #container = document.querySelector('.trip-events__list');
  #state = null;

  constructor({ route }) {
    this.#route = route;
    this.routeView = new RouteView({ route: this.#route });
    this.editView = new EditView({ routesEdit: this.#route });
  }

  getDatepickerOptions = (type) => ({
    defaultDate: this.#route[type],
    dateFormat: 'd/m/y H:i'
  });

  initFlatpickr () {
    flatpickr(document.querySelector('#event-start-time-1'),
      this.getDatepickerOptions('dateFrom'));

    flatpickr(document.querySelector('#event-end-time-1'),
      this.getDatepickerOptions('dateTo'));
  }

  #toggleFavorite = () => {

    this.#route.isFavorite = !this.#route.isFavorite;
    const newRouteView = new RouteView({ route: this.#route });
    this.editView = new EditView({ routesEdit: this.#route });

    replace(newRouteView, this.routeView);
    this.#state = 'VIEW';

    this.routeView = newRouteView;
    this.#rollupSubscribe();
  };

  keydownHandlerClose = (evt) => {
    if (isEscape(evt)) {
      try {
        replace(this.routeView, this.editView);
        this.#state = 'VIEW';
      } catch { /* empty */ }
    }

    document.removeEventListener('keydown', this.keydownHandlerClose);
  };

  #editViewSubscribe = () => {
    this.editView.element
      .querySelector('.event__rollup-btn')
      .addEventListener('click', () => {
        try {
          replace(this.routeView, this.editView);
          this.#state = 'VIEW';
        } catch { /* empty */ }
      });

    this.routeView.element
      .querySelector('.event__favorite-btn')
      .addEventListener('click', this.#toggleFavorite);

    document.addEventListener('keydown', this.keydownHandlerClose);
  };

  #rollupSubscribe = () => {
    this.routeView.element
      .querySelector('.event__rollup-btn')
      .addEventListener('click', () => {
        try {
          replace(this.editView, this.routeView);
        } catch { /* empty */ }
        this.#state = 'EDIT';

        this.initFlatpickr();
        this.#editViewSubscribe();
      });
  };

  setStateView = () => {
    if (this.#state === 'EDIT') {
      try {
        replace(this.routeView, this.editView);
      } catch { /* empty */ }
      this.#state = 'VIEW';
      this.#rollupSubscribe();
    }
  };

  render = () => {
    this.routeView.element
      .querySelector('.event__favorite-btn')
      .addEventListener('click', this.#toggleFavorite);

    render(this.routeView, this.#container);
    this.#rollupSubscribe();

    this.#state = 'VIEW';
  };
}

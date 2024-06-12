import TopFrame from '../view/top-frame';
import { render } from '../framework/render';
import FilterView from '../view/list-filter';
import SortView from '../view/list-sort';
import NewRouteView from '../view/new-point';
import DestionationPhotoView from '../view/destionation-photo';
import DestionationView from '../view/destination-legend';
import OffersView from '../view/offers-list';
import Presenter from './first-present';
import { getDateDiff } from '../utils';
import { filterFuncs } from '../consts';

export default class HeadPresenter {
  #routes = null;
  #offers = null;
  #destinations = null;
  #_original = null;

  #routeInstanse = [];

  constructor(routes, offers, destinations) {
    this.#_original = routes;
    this.#routes = this.#_original.slice();
    this.#offers = offers;
    this.#destinations = destinations;
    this.routerInstanse = null;
  }

  #patchRoute = (type, ID, newInfo = null) => {
    if (type === 'PATCH') {
      this.#routes.map((item, index) => {
        if (item.id === ID) {
          this.#routes[index] = newInfo;
        }
      });
      this.#_original.map((item, index) => {
        if (item.id === ID) {
          this.#_original[index] = newInfo;
        }
      });
    } else if (type === 'DELETE') {
      this.#routes.map((item, index) => {
        if (item.id === ID) {
          delete this.#routes[index];
        }
      });
      this.#_original.map((item, index) => {
        if (item.id === ID) {
          delete this.#_original[index];
        }
      });
    }
  };

  #clearLastRoutesPresenter = () => {
    document.querySelector('.trip-events__list').innerHTML = '';
  };


  // -- HANDLERS -- //

  #handleSortClick (type) {
    if (type === 'sort-day') {
      return (evt) => {
        document.querySelector('.trip-main__event-add-btn').disabled = false;
        this.#clearLastRoutesPresenter();
        evt.target.checked = true;
        this.currentSort = 'sort-day';
        this.#buildAllRoutes(this.#routes.slice().reverse());
      };
    } else if (type === 'sort-time') {
      return (evt) => {
        document.querySelector('.trip-main__event-add-btn').disabled = false;
        this.#clearLastRoutesPresenter();
        evt.target.checked = true;
        this.currentSort = 'sort-time';
        this.#buildAllRoutes(this.#routes.slice().sort((a, b) => getDateDiff(b.dateFrom, b.dateTo) - getDateDiff(a.dateFrom, a.dateTo)));
      };
    } else if (type === 'sort-price') {
      return (evt) => {
        document.querySelector('.trip-main__event-add-btn').disabled = false;
        this.#clearLastRoutesPresenter();
        evt.target.checked = true;
        this.currentSort = 'sort-price';
        this.#buildAllRoutes(this.#routes.slice().sort((a, b) => b.basePrice - a.basePrice));
      };
    }
  }


  #handleFilterClick = (evt) => {
    document.querySelector('#sort-day').checked = true;
    this.#routes = this.#_original.slice().reverse().filter(filterFuncs[evt.target.value]);
    this.#clearLastRoutesPresenter();
    this.#buildAllRoutes(this.#routes);
  };

  // -- BUILDERS -- //

  #buildTopFrame = () => {
    const topFrame = new TopFrame({
      allRoutes: this.#routes,
      allDestanation: this.#destinations
    });

    render(topFrame, document.querySelector('.trip-main'), 'afterbegin');
  };

  #buildFilter = () => {
    const filterView = new FilterView();
    render(filterView, document.querySelector('.trip-controls'));

    filterView.element
      .querySelectorAll('.trip-filters__filter-input')
      .forEach((node) => {
        if (this.#_original.slice().reverse().filter(filterFuncs[node.value]).length === 0) {
          node.disabled = true;
        }
        node.addEventListener('click', this.#handleFilterClick);
      });
  };

  #buildSort = () => {
    const sortView = new SortView();
    render(sortView, document.querySelector('.trip-events'), 'afterbegin');

    sortView.element.querySelector('#sort-day').checked = true;

    sortView.element
      .querySelectorAll('.trip-sort__input--real')
      .forEach((node) => {
        node.addEventListener('click', this.#handleSortClick(node.id));
      });
  };

  #buildAllRoutes = (routes) => {
    const routesPresenter = new Presenter({
      routes: routes,
      offers: this.#offers,
      patchFunc: this.#patchRoute
    });

    routesPresenter.init(this.#destinations);
    this.routerInstanse = routesPresenter;
  };

  #buildBtnCreateRoute = () => {
    const addEventBtn = document.querySelector('.trip-main__event-add-btn');
    addEventBtn.disabled = false;

    let offersView = new OffersView([], this.#offers.filter((item) => item.type === 'flight'));
    this.destionationView = false;
    this.destionationPhotoView = false;

    addEventBtn.addEventListener('click', () => {
      this.routerInstanse.closeAllRoutes();
      const newRouteView = new NewRouteView(this.#offers);
      render(newRouteView, document.querySelector('.trip-events__list'), 'afterbegin');
      newRouteView.init();

      offersView = new OffersView([], this.#offers.filter((item) => item.type === 'flight'));
      render(offersView, newRouteView.element.querySelector('.event__details'));
      const dotsRoutes = newRouteView.element.querySelector('#destination-list-1');

      this.#destinations.forEach((item) => {
        const name = item.name;

        dotsRoutes.innerHTML += `<option value='${name}'></option>`;
      });

      newRouteView
        .element
        .querySelector('#event-destination-1')
        .addEventListener('input', (evt) => {
          newRouteView.element.querySelector('#event-destination-1').value = evt.target.value;

          for (let i = 0; i < this.#destinations.length; i++) {
            if (this.#destinations[i].name === evt.target.value && this.#destinations[i].description !== '') {
              if (this.destionationPhotoView) {
                this.destionationPhotoView.element.remove();
              }
              if (this.destionationView) {
                this.destionationView.element.remove();
              }
              this.destionationView = new DestionationView(this.#destinations[i].description);
              render(this.destionationView, newRouteView.element.querySelector('.event__details'));

              if (this.#destinations[i].pictures.length > 0) {
                this.destionationPhotoView = new DestionationPhotoView(this.#destinations[i].pictures);
                render(this.destionationPhotoView, newRouteView.element.querySelector('.event__section--destination'));
              }
            } else if (this.#destinations[i].name === evt.target.value && this.#destinations[i].description === '') {
              if (this.destionationPhotoView) {
                this.destionationPhotoView.element.remove();
              }
              if (this.destionationView) {
                this.destionationView.element.remove();
              }
            }
          }
        });

      newRouteView
        .element
        .querySelectorAll('.event__type-input')
        .forEach((item) => {
          item.addEventListener('click', (evt) => {
            document.querySelector('#event-type-toggle-1').checked = false;

            newRouteView.element.querySelector('.event__type-icon').src = `img/icons/${evt.target.value}.png`;
            newRouteView.element.querySelector('.event__type-output').textContent = evt.target.value;

            if (evt.target.value !== 'sightseeing') {
              offersView.element.remove();

              offersView = new OffersView([], this.#offers.filter((el) => el.type === evt.target.value));
              render(offersView, newRouteView.element.querySelector('.event__details'));
            } else {
              offersView.element.remove();
            }
          });
        });
    });
  };


  build () {
    this.#buildTopFrame();
    this.#buildFilter();
    this.#buildSort();

    this.#buildAllRoutes(this.#routes.slice().reverse());

    this.#buildBtnCreateRoute();
  }
}

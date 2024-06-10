import RouteView from '../view/point-route';
import EditView from '../view/edit-point';
import DestionationView from '../view/destination-legend';
import { render, replace } from '../framework/render';
import { isEscape, checkUpdate, getAllOffers } from '../utils';
import flatpickr from 'flatpickr';
import dayjs from 'dayjs';
// import { removeRoute } from '../model/task-api-getter';
import OffersView from '../view/offers-list';
import DestionationPhotoView from '../view/destionation-photo';
import { editRoute, removeRoute } from '../model/task-api-getter';
import UiBlocker from '../framework/ui-blocker/ui-blocker';

export default class RoutePresenter {
  #container = document.querySelector('.trip-events__list');
  #patchFunc = null;
  #state = null;

  #uiBlocker = new UiBlocker({
    lowerLimit: 350,
    upperLimit: 1000
  });

  #offers = null;
  #destionations = null;

  #closeAllRoute = null;

  #route = null;

  #routeView = null;
  #editView = null;

  #offesView = null;
  #legendView = null;
  #photoView = null;

  constructor({ route, offers, destionations, closeAllRouteCb, patchFunc }) {
    this.#patchFunc = patchFunc;

    this.#offers = offers;
    this.#destionations = destionations;

    this.#closeAllRoute = closeAllRouteCb;

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
    const thisDestionation = this.#destionations.filter((el) => el.name === this.#route.destination)[0] || '';

    const container = this.#editView.element
      .querySelector('.event__details');

    this.#initFlatpickr();
    this.#insertRealInfo();
    this.#initOffersChooserSubscribe(container);
    this.#initDestInfoChooserSubscribe(container, thisDestionation);
    this.#initSaveBtn();
    this.#initDeleteBtn();
  };

  #switchViewToEdit = () => {
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
    document.removeEventListener('keydown', this.#handleKeydownCloseEdit);

    replace(this.#routeView, this.#editView);
    this.#state = 'VIEW';

    this.#routeViewPackSubscribe();
  };


  // -- MODEL EDIT -- [edit model] //

  #toggleFavorite = () => {
    this.#route.isFavorite = !this.#route.isFavorite;
    this.#reRenderRouteView();
  };


  // -- SUBSCRIBERS --  [work with DOM] //

  #favoriteRouteViewSubscribe = () => {
    this.#routeView
      .element
      .querySelector('.event__favorite-btn')
      .addEventListener('click', this.#toggleFavorite);
  };

  #openEditViewSubscribe = () => {
    const rollupBtn = this.#routeView.element.querySelector('.event__rollup-btn');

    rollupBtn.addEventListener('click', this.#closeAllRoute);
    rollupBtn.addEventListener('click', this.#switchViewToEdit);
  };

  #openRouteViewSubscribe = () => {
    this.#editView
      .element
      .querySelector('.event__rollup-btn')
      .addEventListener('click', this.#switchEditToView);

    document.addEventListener('keydown', this.#handleKeydownCloseEdit);
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

  #initDestInfoChooserSubscribe = (container, thisDestionation) => {

    this.#legendView = new DestionationView(thisDestionation === '' ? '' : thisDestionation.description);
    render(this.#legendView, container);

    this.#photoView = new DestionationPhotoView(thisDestionation === '' ? [] : thisDestionation.pictures);
    render(this.#photoView, container);

    const inputEventName = this.#editView.element.querySelector('#event-destination-1');

    const datalistContainer = this.#editView.element.querySelector('#destination-list-1');

    inputEventName.value = this.#route.destination;

    datalistContainer.innerHTML = '';
    this.#destionations.forEach((item) => {
      datalistContainer.innerHTML += `<option value='${item.name}'></option>`;
    });

    inputEventName.addEventListener('input', this.#handleInputDestionation(thisDestionation));
  };

  #initOffersChooserSubscribe = (container) => {
    this.#offesView = new OffersView(this.#route.offers, this.#offers.filter((el) => el.type === this.#route.type));
    render(this.#offesView, container);

    const eventInFiledset = this.#editView.element.querySelector(`#event-type-${this.#route.type}-1`);
    const eventTypeToggler = this.#editView.element.querySelector('.event__type-toggle');
    const eventTypeText = this.#editView.element.querySelector('.event__type-output');
    const eventTypeIcon = this.#editView.element.querySelector('.event__type-icon');

    eventInFiledset.checked = true;
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
      .addEventListener('click', this.#handleBtnSave);
  };

  #initDeleteBtn = () => {
    this.#editView.element
      .querySelector('.event__reset-btn')
      .addEventListener('click', this.#handleBtnDelete);
  };

  // -- HANDLERS -- //

  #handleBtnDelete = (evt) => {
    evt.preventDefault();
    evt.target.textContent = 'Deleting...';

    this.#uiBlocker.block();

    removeRoute(this.#route.id)
      .then((resp) => {
        if (resp.status === 204) {
          this.#unMountComponent();
          this.#patchFunc('DELETE', this.#route.id);
        }
      })
      .catch(() => {
        this.#editView.shake(() => {
          evt.target.textContent = 'Delete';
        });
      });

    this.#uiBlocker.unblock();
  };

  #handleBtnSave = (evt) => {
    evt.preventDefault();

    const uiBlocker = new UiBlocker(350, 1000);

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
      uiBlocker.block();
      editRoute(this.#route.id, newRoute, this.#destionations)
        .then((data) => {
          console.log(data);
        });

      uiBlocker.unblock();

      this.#route = newRoute;
      this.#patchFunc('PATCH', this.#route.id, newRoute);
      this.#switchEditToView();
      this.#reRenderRouteView();
    } else {
      this.#switchEditToView();
    }
  };

  #handleInputDestionation = (thisDestionation) => (evt) => {
    thisDestionation = this.#destionations.filter((el) => el.name === evt.target.value)[0];

    if (typeof thisDestionation !== 'undefined') {
      const newLegendComponent = new DestionationView(thisDestionation.description);
      replace(newLegendComponent, this.#legendView);
      this.#legendView = newLegendComponent;

      const newPhotoComponent = new DestionationPhotoView(thisDestionation.pictures);
      replace(newPhotoComponent, this.#photoView);
      this.#photoView = newPhotoComponent;
    }
  };

  #handleClickEventType = (eventTypeToggler, eventTypeText, eventTypeIcon) => (evt) => {
    eventTypeToggler.checked = false;

    eventTypeText.textContent = evt.target.value;
    eventTypeIcon.src = `img/icons/${evt.target.value}.png`;

    const newOffersComponent = new OffersView([], this.#offers.filter((el) => el.type === evt.target.value));
    replace(newOffersComponent, this.#offesView);
    this.#offesView = newOffersComponent;
  };

  #handleKeydownCloseEdit = (evt) => {
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

  #unMountComponent = () => {
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
  //         this.editView
  //           .element
  //           .querySelector('.event__save-btn')
  //           .addEventListener('click', (evt) => {
  //             evt.preventDefault();
  //             try {
  //               this.offersView.element.remove();
  //               this.#route.type = typeCopy;
  //               this.routeView = new RouteView({ route: this.#route, allOffers: this.#allOffers
  //                 .filter((item) => item.type === this.#route.type) });
  //               replace(this.routeView, this.editView);
  //               this.#rollupSubscribe();
  //               this.editView.element.querySelector('.event__details').innerHTML = '';
  //               this.#state = 'VIEW';
  //             } catch { /* empty */ }
  //           });

  //         this.editView
  //           .element
  //           .querySelector('.event__reset-btn')
  //           .addEventListener('click', (evt) => {
  //             evt.target.textContent = 'Deleting...';
  //             removeRoute(this.#route.id)
  //               .then((data) => {
  //                 if (data.status === 204) {
  //                   this.editView.element.remove();
  //                   document.removeEventListener('keydown', this.keydownHandlerClose);
  //                 }
  //               })
  //               .catch(() => this.editView.shake(() => {}));
  //           });
  //         this.#state = 'EDIT';
  //       } catch { /** empty */ }
  //     });
  // }
}

import RoutePresenter from './route-presenter.js';

export default class Presenter {
  #routes = null;
  #offers = null;
  routesInstanse = [];

  constructor({ routes, offers, patchFunc, uiBlocker }) {
    this.#routes = routes;
    this.#offers = offers;
    this.patchFunc = patchFunc;
    this.uiBlocker = uiBlocker;
  }

  closeAllRoutes = () => {
    const newRouteView = document.querySelector('.trip-events__item-new');
    if (newRouteView) {
      newRouteView.remove();
      document.querySelector('.trip-main__event-add-btn').disabled = false;
    }

    this.routesInstanse.forEach((item) => {
      item.closeThisRoute();
    });
  };

  init(allDestanation) {
    this.#routes.forEach((item) => {
      allDestanation.map((el) => {
        if (el.id === item.destination) {
          item.destination = el.name;
        }
      });

      const view = new RoutePresenter({ route: item, offers: this.#offers, destionations: allDestanation, closeAllRouteCb: this.closeAllRoutes, patchFunc: this.patchFunc, uiBlocker: this.uiBlocker });
      this.routesInstanse.push(view);

      view.render();
    });
  }
}

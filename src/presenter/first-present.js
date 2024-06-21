import RoutePresenter from './route-presenter.js';

export default class Presenter {
  #routes = null;
  #offers = null;
  routesInstances = [];

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

    this.routesInstances.forEach((item) => {
      item.closeThisRoute();
    });
  };

  init(allDestination) {
    this.#routes.forEach((item) => {
      allDestination.map((el) => {
        if (el.id === item.destination) {
          item.destination = el.name;
        }
      });

      const view = new RoutePresenter({ route: item, offers: this.#offers, destinations: allDestination, closeAllRouteCb: this.closeAllRoutes, patchFunc: this.patchFunc, uiBlocker: this.uiBlocker });
      this.routesInstances.push(view);

      view.render();
    });
  }
}

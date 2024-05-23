import RoutePresenter from './route-presenter.js';
import SortView from '../view/list-sort.js';
import TopFrame from '../view/top-frame.js';
import NewRouteView from '../view/new-point.js';
import { render } from '../framework/render.js';

export default class Presenter {
  #routes = null;
  routesInstanse = [];

  constructor({ routes }) {
    this.#routes = routes;
  }

  closeAllRoutes = () => {
    this.routesInstanse.forEach((item) => {
      item.setStateView();
    });
  };

  init() {
    this.#routes.forEach((item) => {
      const view = new RoutePresenter({ route: item });
      this.routesInstanse.push(view);

      view.render();
    });

    const topFrame = new TopFrame({ info: { cost: this.#routes.reduce((currentSum, item) => currentSum + item.basePrice, 0) } });
    render(topFrame, document.querySelector('.trip-main'), 'afterbegin');

    const sort = new SortView();
    render(sort, document.querySelector('.trip-events'), 'afterbegin');

    const addEventBtn = document.querySelector('.trip-main__event-add-btn');
    addEventBtn.addEventListener('click', () => {
      this.closeAllRoutes();
      const newRouteView = new NewRouteView();

      render(newRouteView, document.querySelector('.trip-events__list'), 'afterbegin');
      newRouteView.init();
    });
  }
}

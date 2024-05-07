import { render } from '../render.js';
import RouteView from '../view/point-route.js';
import { replace } from '../framework/render.js';
import EditView from '../view/edit-point.js';
import { isEscape } from '../utils.js';

export default class Presenter {
  #container = document.querySelector('.trip-events__list');

  constructor({ routes }) {
    this.routes = routes;
  }

  #submitHandler(evt) {
    evt.preventDefault();
  }

  init() {
    this.routes.forEach((route) => {

      const routeView = new RouteView({route: route});
      const editView = new EditView({routesEdit: route});

      routeView.element.querySelector('.event__rollup-btn')
        .addEventListener('click', () => {
          replace(editView, routeView);

          editView.element
            .querySelector('.event__save-btn')
            .addEventListener('click', this.#submitHandler);

          editView.element
            .querySelector('.event__rollup-btn')
            .addEventListener('click', clickHandlerClose);
          document.addEventListener('keydown', keydownHandlerClose);

          function clickHandlerClose() {
            try {
              replace(routeView, editView);
              document.removeEventListener('keydown', keydownHandlerClose);
            } catch {
              document.removeEventListener('keydown', keydownHandlerClose);
            }
          }

          function keydownHandlerClose(evt) {
            if (isEscape(evt)) {
              clickHandlerClose();
            }
          }
        });

      render(routeView, this.#container);
    });
  }
}

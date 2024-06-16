import { connectionFields } from './consts.js';
import Model from './model/first-model.js';
import HeadPresenter from './presenter/head-presenter.js';
// hooked--listener

const Modeler = new Model(...connectionFields);

document.querySelector('.trip-main__event-add-btn').disabled = true;

document
  .querySelector('.trip-events')
  .innerHTML += '<p class="trip-events__msg loading-animation">Loading...</p>';

Modeler
  .init()
  .then(([offers, destinations, routes]) => {
    document.querySelector('.trip-events__msg').remove();

    const headPresenter = new HeadPresenter(routes, offers, destinations);
    headPresenter.build();
  });

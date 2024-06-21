import { ConnectionField } from './consts.js';
import Model from './model/model.js';
import HeadPresenter from './presenter/head-presenter.js';
// hooked--listener--1

const Modeler = new Model(...ConnectionField);

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

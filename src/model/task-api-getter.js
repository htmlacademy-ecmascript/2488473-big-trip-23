/* eslint-disable camelcase */
import ApiService from '../framework/api-service';
import { connectionFields } from '../consts';

const router = new ApiService(...connectionFields);

function adaptToServer (route, allDestanation) {
  const adaptedRoute = {
    id: route.id,
    base_price: route.basePrice,
    date_from: route.dateFrom,
    date_to: route.dateTo,
    destination: allDestanation.filter((item) => item.name === route.destination)[0].id,
    is_favorite: route.isFavorite,
    offers: route.offers,
    type: route.type
  };

  return adaptedRoute;
}

async function getDestinations () {
  return await router
    ._load({url: 'big-trip/destinations'})
    .then(ApiService.parseResponse)
    .then((data) => data);
}

async function getOffers () {
  return await router
    ._load({url: 'big-trip/offers'})
    .then(ApiService.parseResponse)
    .then((data) => data);
}

async function getRoutes(adaptFunc) {
  return router._load({url: 'big-trip/points'})
    .then(ApiService.parseResponse)
    .then((data) => data.map(adaptFunc));
}

async function removeRoute(ID) {
  return await router
    ._load({url: `big-trip/points/${ID}`, method: 'DELETE'});
}

async function editRoute(ID, newRoute, allDestanation) {
  return await router
    ._load({
      url: `big-trip/points/${ID}`,
      method: 'PUT',
      body: JSON.stringify(adaptToServer(newRoute, allDestanation)),
      headers: new Headers({ 'Content-Type': 'application/json' })
    });
}

export { getOffers, getDestinations, removeRoute, getRoutes, editRoute };

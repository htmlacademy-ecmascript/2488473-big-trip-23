import ApiService from '../framework/api-service';
import { getDestinations, getOffers, getRoutes } from './task-api-getter';

export default class Model extends ApiService{
  offers = [];
  destinations = [];
  routes = [];

  constructor(props) {
    super(props);
  }

  #adaptToClient (route) {
    const adaptedRoute = {
      ...route,
      basePrice: route['base_price'],
      dateFrom: route['date_from'],
      dateTo: route['date_to'],
      isFavorite: route['is_favorite']
    };

    delete adaptedRoute['base_price'];
    delete adaptedRoute['date_from'];
    delete adaptedRoute['date_to'];
    delete adaptedRoute['is_favorite'];

    return adaptedRoute;
  }

  init = async () => {
    this.offers = await getOffers();
    this.destinations = await getDestinations();
    this.routes = await getRoutes(this.#adaptToClient);

    return ([this.offers, this.destinations, this.routes]);
  };
}

import dayjs from 'dayjs';

function getRandomArrayElement(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function getRandomNumber(min, max) {
  return min + Math.random() * (max - min);
}

function isEscape(evt) {
  return evt.key === 'Escape';
}

function checkArrayUpdate(prevRoute, newRoute) {
  return newRoute.every((item) => prevRoute.includes(item));
}

function checkUpdate(prevRoute, newRoute) {
  return (
    prevRoute.basePrice === newRoute.basePrice &&
    prevRoute.dateFrom.slice(0, -5) === newRoute.dateFrom.slice(0, -5) &&
    prevRoute.dateTo.slice(0, -5) === newRoute.dateTo.slice(0, -5) &&
    prevRoute.destination === newRoute.destination &&
    prevRoute.id === newRoute.id &&
    prevRoute.type === newRoute.type &&
    prevRoute.isFavorite === newRoute.isFavorite &&
    checkArrayUpdate(prevRoute.offers, newRoute.offers)
  );
}

function getAllOffers (nodeList) {
  const results = [];

  nodeList.forEach((node) => {
    results.push(node.dataset.id);
  });
  return results;
}

function getDateDiff (dateFrom, dateTo) {
  return dayjs(dateTo).diff(dateFrom);
}

function getHeaderRow (routes) {
  const destinations = [];
  routes.map((item) => destinations.push(item.destination));

  if (!destinations || !destinations.length) {
    return '';
  }

  if (destinations.length === 1) {
    return destinations[0];
  }

  if (destinations.length === 2) {
    return `${destinations[0]} - ${destinations[1]}`;
  }

  const first = destinations[0];
  const middle = destinations.slice(1, -1);
  const last = destinations.at(-1);

  return `${first} - ${middle.length === 1 ? middle[0] : '...'} - ${last}`;
}

export { getRandomArrayElement as default, getRandomNumber, isEscape, checkUpdate, getAllOffers, getDateDiff, getHeaderRow };

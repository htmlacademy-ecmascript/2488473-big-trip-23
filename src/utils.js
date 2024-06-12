import dayjs from 'dayjs';

function getRandomArrayElement(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function getRandomNumber(min, max) {
  return min + Math.random() * (max - min);
}

function isEscape(evt) {
  if (evt.key === 'Escape') {
    return true;
  }

  return false;
}

function checkArrayUpdate(prevRoute, newRoute) {
  if (prevRoute.length === newRoute.length) {
    for (let i = 0; i < prevRoute.length; i++) {
      if (!newRoute.includes(prevRoute[i])) {
        return false;
      }
    }
    return true;
  }

  return false;
}

function checkUpdate(prevRoute, newRoute) { // -> retrun true if arrays equals
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
  const result = [];

  nodeList.forEach((node) => {
    result.push(node.dataset.id);
  });
  return result;
}

function getDateDiff (dateFrom, dateTo) {
  return dayjs(dateTo).diff(dateFrom);
}

export { getRandomArrayElement as default, getRandomNumber, isEscape, checkUpdate, getAllOffers, getDateDiff };

import { getDateDiff } from './utils';

const TimeFormat = 'HH:mm';
const TimeFormatView = {
  MINUTE: 'mm[M]',
  HOUR: 'HH[H] mm[M]',
  DAY: 'DD[D] HH[H] mm[M]'
};
const TimeFormatEdit = 'DD/MM/YY HH:mm';

const ConnectionField = ['https://23.objects.htmlacademy.pro', 'Basic afdasf6Hfwj73C'];

const FilterFunc = {
  EVERYTHING: () => true,
  FUTURE: (item) => new Date(item.dateFrom) > new Date(),
  PRESENT: (item) => new Date(item.dateFrom) <= new Date() && new Date(item.dateTo) >= new Date(),
  PAST: (item) => new Date(item.dateTo) < new Date()
};

const SortFunc = {
  DAY: (routeA, routeB) => new Date(routeA.dateTo) - new Date(routeB.dateTo),
  TIME: (routeA, routeB) => getDateDiff(routeB.dateFrom, routeB.dateTo) - getDateDiff(routeA.dateFrom, routeA.dateTo),
  PRICE: (routeA, routeB) => routeB.basePrice - routeA.basePrice,
};

export { TimeFormat as default, TimeFormatEdit, ConnectionField, TimeFormatView, FilterFunc, SortFunc };

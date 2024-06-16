import { getDateDiff } from './utils';

const timeFormat = 'HH:mm';
const timeFormatView = {
  minutly: 'mm[M]',
  hourly: 'HH[H] mm[M]',
  dayly: 'DD[D] HH[H] mm[M]'
};
const timeFormatEdit = 'DD/MM/YY HH:mm';

const connectionFields = ['https://23.objects.htmlacademy.pro', 'Basic aesadffdasf6Hfwj73C'];

const filterFuncs = {
  everything: () => true,
  future: (item) => new Date(item.dateFrom) > new Date(),
  present: (item) => new Date(item.dateFrom) <= new Date() && new Date(item.dateTo) >= new Date(),
  past: (item) => new Date(item.dateTo) < new Date()
};

const sortFuncs = {
  'sort-day': (routeA, routeB) => new Date(routeA.dateTo) - new Date(routeB.dateTo),
  'sort-time': (routeA, routeB) => getDateDiff(routeB.dateFrom, routeB.dateTo) - getDateDiff(routeA.dateFrom, routeA.dateTo),
  'sort-price': (routeA, routeB) => routeB.basePrice - routeA.basePrice,
};

export { timeFormat as default, timeFormatEdit, connectionFields, timeFormatView, filterFuncs, sortFuncs };

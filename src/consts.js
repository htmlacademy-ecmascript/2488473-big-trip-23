
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
  present: (item) => item.dateFrom <= new Date() && item.dateTo >= new Date(),
  past: (item) => item.dateTo < new Date()
};

export { timeFormat as default, timeFormatEdit, connectionFields, timeFormatView, filterFuncs };

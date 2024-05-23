const timeFormat = 'HH:mm';
const timeFormatEdit = 'DD/MM/YY HH:mm';

const eventTypes = [
  'taxi',
  'bus',
  'train',
  'ship',
  'drive',
  'flight',
  'check-in',
  'sightseeing',
  'restaurant',
];
const offerTypes = [
  { luggage: 'Add luggage', price: 50 },
  { comfort: 'Switch to comfort', price: 80 },
  { meal: 'Add meal', price: 15 },
  { seats: 'Choose seats', price: 5 },
  { train: 'Travel by train', price: 40 },
];

export { timeFormat as default, eventTypes, offerTypes, timeFormatEdit };

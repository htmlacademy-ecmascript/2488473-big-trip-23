import getRandomArrayElement from '../utils.js';

const mockRoutes = [
  {
    id: 'f4b62099-263f-4c3d-a702-94eec4a2808c',
    name: 'Germany',
    basePrice: 500,
    dateFrom: '2019-07-10T22:55:56.845Z',
    dateTo: '2019-07-11T11:22:13.375Z',
    destination: 'bfa6cb75-a1fe-4b77-a83c-0e528e910e04',
    isFavorite: false,
    offers: [],
    type: 'taxi',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
  },
  {
    id: 'f4b62099-297f-4c3d-a702-94eec4a2808c',
    basePrice: 340,
    name: 'Austrlia',
    dateFrom: '2019-07-10T22:55:56.845Z',
    dateTo: '2019-07-11T11:22:13.375Z',
    destination: 'bfa5cb75-a1fe-4b77-a93c-0e528e910e04',
    isFavorite: false,
    offers: [{ title: 'Add luggage', price: 120 }],
    type: 'drive',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
  },
  {
    id: 'f4b62099-293f-4c3d-a702-94eec8a2808c',
    basePrice: 900,
    name: 'Brazilia',
    dateFrom: '2019-07-10T22:55:56.845Z',
    dateTo: '2019-07-11T11:22:13.375Z',
    destination: 'bfa5cb75-a1fe-4b77-a83c-0e828e910e04',
    isFavorite: false,
    offers: [{ title: 'Add luggage', price: 120 }, { title: 'Choose seats', price: 169 }],
    type: 'taxi',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
  },
  {
    id: 'f4b62099-293f-4c3d-a702-94eec3a2808c',
    basePrice: 120,
    name: 'Gargantuya',
    dateFrom: '2019-07-10T22:55:56.845Z',
    dateTo: '2019-07-11T11:22:13.375Z',
    destination: 'bfa5cb75-a1fe-4b77-a83c-0e528e010e04',
    isFavorite: true,
    offers: [{ title: 'Add luggage', price: 120 }, { title: 'Add meal', price: 120 }, { title: 'Travel by train', price: 120 }],
    type: 'flight',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
  }
];

const mockRoutesEdit = {
  type: 'check-in',
  destination: 'London',
  dateFrom: '2019-07-10T22:55:56.845Z',
  dateTo: '2019-07-11T11:22:13.375Z',
  price: 259,
  offers: ['seats', 'comfort'],
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
};

const getRandomRoute = () => getRandomArrayElement(mockRoutes);

export { getRandomRoute as default, mockRoutesEdit };

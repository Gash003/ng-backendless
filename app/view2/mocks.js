var stockState = [
  {"stockItem": "Carrot", "quantity": 3},
  {"stockItem": "Cheese", "quantity": "1kg"}
];

// import users from './jsonFiles/user.json';

export default function stockMock($httpBackend) {
  $httpBackend.whenGET('stock').respond(200, stockState);
}

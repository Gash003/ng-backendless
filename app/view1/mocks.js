var users = [
  {"name": "John", "lastName": "Doe"},
  {"name": "Kate", "lastName": "Smith"},
  {"name": "Piotr", "lastName": "Kowalski"}
];

// import users from './jsonFiles/user.json';

export default function userMock($httpBackend) {
  $httpBackend.whenGET('users').respond(200, users, 2000);
}

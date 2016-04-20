'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', ['$scope', '$http', function($scope, $http) {

  $scope.isLoading = true;
  
  $scope.users = [];

  $http.get('users').then(
    ({data}) => angular.copy(data, $scope.users),
    () => $scope.users = 'Error while loading users'
  ).finally(() => $scope.isLoading = false);
  
}]);

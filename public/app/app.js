'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.books',
  'myApp.book',
  'myApp.user',
  'myApp.users',
  'myApp.navigation',
  'myApp.version',
  'hrCore',
  'hrSiren'
])

.directive('parentDirective', function($http, $compile){
  return {
    restrict: 'E',
    controller: function ($scope, $element, $attrs) {

      $scope.navigation = {};
      $scope.data = {};

      $scope.loadNavigation = function(successCallback){
        $http({
          method: 'GET',
          url: '/',
          headers: {
            'Accept': 'application/vnd.siren+json',
            'Content-Type' : 'application/x-www-form-urlencoded'
          }
        }).then(function(response) {
          $scope.navigation = response.data;
          successCallback();
        }, function errorCallback(response) {
          alert('Error: ' + response);
        });
      }

      $scope.loadResource = function(url, method, formName){
        if(typeof method == "undefined") {method = 'GET';}
        var data = {};
        if(typeof formName !== "undefined") {
          if(method == 'GET'){
            url += '?' + $('[name="'+ formName +'"]').serialize();
          } else {
            data = $('[name="'+ formName +'"]').serialize();
          }
        }

        $http({
          method: method,
          url: url,
          data: data,
          headers: {
            'Accept': 'application/vnd.siren+json',
            'Content-Type' : 'application/x-www-form-urlencoded'
          }
        }).then(function(response) {
          var htm = '';
          $scope.data = response.data;

          switch (response.data.class) {
            case "NavigationResource":
              break;
            case "BooksListResource":
              htm = '<books-directive></books-directive>';
              break;
            case "BookResource":
              htm = '<book-directive></book-directive>';
              break;
            case "UsersListResource":
              htm = '<users-directive></users-directive>';
              break;
            case "UserResource":
              htm = '<user-directive></user-directive>';
              break;
            default:
              console.log("Sorry, we are out of .");
          }
          var compiled = $compile(htm)($scope);
          $element.html(compiled);
          }, function errorCallback(response) {
            alert('Error: ' + response);
          });
      };

      $scope.getHrefByRel = function(links, rel){
        for(var link of links){
          for(var currRel of link.rel){
            if(currRel == rel){
              return link.href;
            }
          }
        }
        return '';
      }

      $scope.loadNavigation(function(){
          $scope.loadResource($scope.getHrefByRel($scope.navigation.links, 'Books'));
      });
    }
  }
});

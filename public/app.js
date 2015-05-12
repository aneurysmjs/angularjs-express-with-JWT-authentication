(function(){
   'use strict';
   var app = angular.module('app', []);
   /*
   * because we're serving this on different URL's
   * this is to make sure that all of our http requests will go throught the same URL
   */
   app.constant('API_URL', 'http://localhost:1989');

   app.controller('MainController', function(RandomUserFactory){
      'use strict';
      var vm = this;

      function getRandomUser(){
         RandomUserFactory.getUser().then(function success(response){
            vm.randomUser = response.data;
         });
      }

      vm.getRandomUser = getRandomUser;
   });

   app.factory('RandomUserFactory', function RandomUserFactory($http, API_URL){
      'use strict';

      function getUser() {
         return $http.get(API_URL + '/random-user');
      }

      return {
         getUser: getUser
      };

   });

}());
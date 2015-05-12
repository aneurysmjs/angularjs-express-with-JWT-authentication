
(function(){
   'use strict';
   var app = angular.module('app', []);

   // because we're serving this on different URL's
   // this is to make sure that all of our http requests will go thought the same URL

   app.constant('API_URL', 'http://localhost:1989');

   app.controller('MainController', function MainController(RandomUserFactory, UserFactory){
      'use strict';
      var vm = this;

      function getRandomUser() {
         RandomUserFactory.getUser().then(function success(response) {
            vm.randomUser = response.data;
         },handleError);
      }

      function login(username, password) {

         UserFactory.login(username, password).then(function success(response) {
            /*
             * before we were expecting a user with this login response.
             * Now we're getting an object that has the user on it.
             * We'll say 'vm.user' equals that user.
             */
            vm.user = response.data.user;
            //We'll just alert with the response.data.token.
            alert(response.data.user);
         }, handleError);
      }

      function handleError(response) {
         alert('Error: ' + response.data);
      }

      vm.getRandomUser = getRandomUser;
      vm.login = login;

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

   app.factory('UserFactory', function UserFactory($http, API_URL){
      'use strict';

      function login(username, password) {
         return $http.post(API_URL + '/login', {
            username: username,
            password: password
         });
      }

      return {
         login: login
      };

   });
}());

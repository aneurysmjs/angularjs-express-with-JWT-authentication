
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

   app.factory('UserFactory', function UserFactory($http, API_URL, AuthTokenFactory){
      'use strict';

      function login(username, password) {
         return $http.post(API_URL + '/login', {
            username: username,
            password: password
         }).then(function success(response) {
            /*
            * When we login, we want to save this token, so we'll add a then here.
            * Here we'll take auth token factory and set token to the response.data.token,
            */
            AuthTokenFactory.setToken(response.data.token);
            // and then we'll return the response for future items in the chain.
            return response;
         });
      }

      return {
         login: login
      };

   });

   /*
   * Let's go ahead and set up saving this to local storage.
   * We're going to create a factory that will manage our token for us.
   */
   app.factory('AuthTokenFactory', function AuthTokenFactory($window) {
      'use strict';

      var store = $window.localStorage,
          key = 'auth-token';
      function getToken() {
         return store.getItem(key);
      }

      function setToken(token) {
         if(token){
            store.setItem(key, token);
         } else {
            store.removeItem(key);
         }
      }

      return {
         getToken: getToken,
         setToken: setToken
      };
   });
   /*
   * now we're going to use what in Angular is called an interceptor,
   * and we're going to create that as a factory.
   */
   app.factory('AuthInterceptor', function AuthInterceptor(AuthTokenFactory) {
      'use strict';
      /*
      * interceptors have a couple of cool things on them.
      * You have the request, the request error response, and response error.
      * Each one of them is doing different things to the HTTP config.
      * The one that we care about is the 'request'.
      *
      */

      //and then here we'll implement 'addToken'.
      // It'll take the config, and it'll return the config.
      function addToken(config) {
         var token = AuthTokenFactory.getToken();

         //  Now if there is a token, so if the user is authenticated.
         if(token){
            // then we're going to add this to a header on this config object,
            config.headers = config.headers || {};
            config.headers.Authorization = 'Bearer ' + token;
         }

         return config;
      }

      return {
         //so we'll have 'request' and it will be 'addToken'.
         request: addToken
      };


   });

}());

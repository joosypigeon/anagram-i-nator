'use strict';

app.factory('wordData', function ($http) {
   return {
      getWords: function(time, letters, successCb, errorCb){
         $http({method: 'GET', url: '/data/' + letters})
                 .success(function (data, status, headers, config) {
                    successCb(time, data);
                 }).error(function (data, status, headers, config) {
                     errorCb();
         });
      }
   };
});
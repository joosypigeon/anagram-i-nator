'use strict';

app.factory('anagramData', function ($http) {
   return {
      getAnagrams: function (time, phraseA, phraseB, successCb, errorCb) {
         $http({method: 'GET', url: '/data/' + phraseA + '-' + phraseB})
                 .success(function (data, status, headers, config) {
                    successCb(time, data);
                 }).error(function (data, status, headers, config) {
            errorCb();
         });
      }
   };
});


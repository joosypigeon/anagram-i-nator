'use strict';

app.factory('anagramData', function($http){
   return {
      getAnagrams: function(phraseA, phraseB, successCb, errorCb){
         $http({method: 'GET', url: '/data/'+phraseA+'-'+phraseB})
            .success(function(data, status, headers, config){
               successCb(data);
            }).error(function(data, status, headers, config){
               errorCb();
            });
      }
   };
});


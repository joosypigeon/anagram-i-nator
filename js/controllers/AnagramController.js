'use strict';

app.controller('AnagramController',
  function($scope, compare){  
   $('#firstUnmatched').height(60);
   $('#firstWords').height(200);
   $('#secondUnmatched').height(60);
 

    $scope.first = '';
    $scope.firstUnmatched = '';
    $scope.firstWords = '';
    $scope.second = '';
    $scope.secondUnmatched = '';
    $scope.secondWords = '';
        
    // waiting is set to true if we are waiting for anagram data
    $scope.waiting = false; 
    
    // pending is set to true if there has been a change while we are waiting
    // for anagram data
    $scope.pending = false; 
    
    $scope.update = function(){
       compare.update($scope);
    };
    

});
'use strict';

app.controller('AnagramController',
  function($scope, compare){
    var firstUnmatched = $('#firstUnmatched').height(60),
         secondUnmatched=$('#secondUnmatched').height(60);
       
    $scope.first = '';
    $scope.firstUnmatched = '';
    $scope.second = '';
    $scope.secondUnmatched = '';
    
    $scope.update = function(){
       compare.update($scope.first, $scope.second, firstUnmatched, secondUnmatched);
    };
});
'use strict';

app.controller('AnagramController',
        function ($scope, compare) {
           var i, a;
           $('#firstUnmatched').height(60);
           $('.firstWords').height(200);
           $('#secondUnmatched').height(60);
           $('.secondWords').height(200);


           $scope.first = '';
           $scope.firstUnmatched = '';
           a = [];
           for (i = 0; i < app.MAX_LETTERS; i++) {
              a.push('');
           }
           $scope.firstWordsAll = a;

           $scope.second = '';
           $scope.secondUnmatched = '';
           a = [];
           for (i = 0; i < app.MAX_LETTERS; i++) {
              a.push('');
           }
           $scope.secondWordsAll = a;


           // waiting is set to true if we are waiting for anagram data
           $scope.waiting = false;

           // pending is set to true if there has been a change while we are waiting
           // for anagram data
           $scope.pending = false;

           $scope.update = function () {
              compare.update($scope);
           };


        });
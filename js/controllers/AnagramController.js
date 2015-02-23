'use strict';

app.controller('AnagramController',
        function ($scope, compare) {
           var i, a;
           $('#firstUnmatched').height(60);

           $('#secondUnmatched').height(60);


           $scope.wordsTitle = [
              'words of length 1 and 2',
              'words of length 3',
              'words of length 4',
              'words of length 5',
              'words of length 6',
              'words of length 7',
              'words of length 8',
              'words of length 9',
              'words of length 10',
              'words of length 11',
              'words of length 12',
              'words of length 13',
              'words of length 14',
              'words of length 15',
           ];
           
           $scope.showFirst = 'first0';
           $scope.showSecond = 'second0';
           
           $scope.first = '';
           $scope.firstUnmatched = '';
           a = [];
           for (i = 0; i < app.MAX_WORD_LENGTH - 1; i++) {
              a.push('');
           }
           $scope.firstWordsAll = a;

           $scope.second = '';
           $scope.secondUnmatched = '';
           a = [];
           for (i = 0; i < app.MAX_WORD_LENGTH - 1; i++) {
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
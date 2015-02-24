'use strict';

app.controller('AnagramController', ['$scope', '$sce', 'compare', function ($scope, $sce, compare) {
      var i, a, b, firstActive = 0, secondActive = 0;
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


      $scope.first = '';
      $scope.firstUnmatched = '';
      a = [];
      b = [];
      for (i = 0; i < app.MAX_WORD_LENGTH - 1; i++) {
         a.push([]);
         b.push[0];
      }
      $scope.firstWordsAll = a;
      $scope.firstWordsCount = b;

      $scope.second = '';
      $scope.secondUnmatched = '';
      a = [];
      b = [];
      for (i = 0; i < app.MAX_WORD_LENGTH - 1; i++) {
         a.push([]);
         b.push(0);
      }
      $scope.secondWordsAll = a;
      $scope.secondWordsCount = b;


      $scope.firstCount = 0;
      $scope.secondCount = 0;
      $scope.maxLetters = app.MAX_LETTERS;



      $scope.showFirst = function (index) {
         return $scope.firstWordsAll[index].length !== 0;
      };
      $scope.showSecond = function (index) {
         return $scope.secondWordsAll[index].length !== 0;
      };

      $scope.getFirstActive = function (index) {
         return index === firstActive;
      };
      $scope.getSecondActive = function (index) {
         return index === secondActive;
      };

      $scope.setFirstActive = function (index) {
         firstActive = index;
      };
      $scope.setSecondActive = function (index) {
         secondActive = index;
      };

      $scope.firstForward = function () {
         firstActive = (firstActive + 1) % (app.MAX_WORD_LENGTH - 1);
      };
      $scope.firstBack = function () {
         firstActive = (firstActive + app.MAX_WORD_LENGTH - 2) % (app.MAX_WORD_LENGTH - 1);
      };

      $scope.secondForward = function () {
         secondActive = (secondActive + 1) % (app.MAX_WORD_LENGTH - 1);
      };
      $scope.secondBack = function () {
         secondActive = (secondActive + app.MAX_WORD_LENGTH - 2) % (app.MAX_WORD_LENGTH - 1);
      };

      // Pagination
      $scope.currentFirstPage = [];
      for (i = 0; i < app.MAX_WORD_LENGTH - 1; i++) {
         $scope.currentFirstPage.push(0);
      }
       $scope.currentSecondPage = [];
      for (i = 0; i < app.MAX_WORD_LENGTH - 1; i++) {
         $scope.currentSecondPage.push(0);
      }
      // HACK!
      $scope.pageSize = [100,120,90,70,60,55,50,45,40,35,30,30,30,30];
      
      
      
      
         
      $scope.setCurrentFirstPage = function (index, currentPage) {
         $scope.currentFirstPage[index] = currentPage;
      }
      $scope.getCurrentFirstPage = function (index) {
         return $scope.currentFirstPage[index];
      }


      $scope.numberOfFirstPages = function (index) {
         return Math.ceil($scope.firstWordsAll[index].length / $scope.pageSize[index]);
      };

      $scope.previousFirstPage = function(index) {
         $scope.currentFirstPage[index] = ($scope.currentFirstPage[index] + $scope.numberOfFirstPages(index) - 1) % $scope.numberOfFirstPages(index);
         console.log($scope.currentFirstPage[index]);
      }
      
      $scope.nextFirstPage = function(index) {
         $scope.currentFirstPage[index] = ($scope.currentFirstPage[index] + 1) % $scope.numberOfFirstPages(index);
      }







     $scope.setCurrentSecondPage = function (index, currentPage) {
         $scope.currentSecondPage[index] = currentPage;
      }
      $scope.getCurrentSecondPage = function (index) {
         return $scope.currentSecondPage[index];
      }


      $scope.numberOfSecondPages = function (index) {
         return Math.ceil($scope.secondWordsAll[index].length / $scope.pageSize[index]);
      };

      $scope.previousSecondPage = function(index) {
         $scope.currentSecondPage[index] = ($scope.currentSecondPage[index] + $scope.numberOfSecondPages(index) - 1) % $scope.numberOfSecondPages(index);
      }
      
      $scope.nextSecondPage = function(index) {
         $scope.currentSecondPage[index] = ($scope.currentSecondPage[index] + 1) % $scope.numberOfSecondPages(index);
      }





      // update unmatched letters and ask server for words from unmatched
      // letters
      $scope.update = function () {
         compare.update($scope);
      };
   }]);
'use strict';

app.controller('AnagramController', ['$scope', '$compile', 'filterFilter', 'compare', function ($scope, $compile, filterFilter, compare) {
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
      $scope.firstWordsFiltered = a;
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
      $scope.secondWordsFiltered = a;
      $scope.secondWordsCount = b;


      $scope.firstCount = 0;
      $scope.secondCount = 0;
      $scope.maxLetters = app.MAX_LETTERS;

      $scope.setFirst = function (str) {
         console.log('setFirst:' + str);
         $scope.first = str;
      }
      $scope.setSecond = function (str) {
         console.log('setSecond:' + str);
         $scope.second = str;
      }

      $scope.showFirst = function (index) {
         return $scope.firstWordsFiltered[index].length !== 0;
      };
      $scope.showSecond = function (index) {
         return $scope.secondWordsFiltered[index].length !== 0;
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
      
      // HACK for pagination
      $scope.pageSize = [100, 120, 90, 70, 60, 55, 50, 45, 40, 35, 30, 30, 30, 30];





      $scope.setCurrentFirstPage = function (index, currentPage) {
         $scope.currentFirstPage[index] = currentPage;
      }
      $scope.getCurrentFirstPage = function (index) {
         return $scope.currentFirstPage[index];
      }


      $scope.numberOfFirstPages = function (index) {
         return Math.ceil($scope.firstWordsFiltered[index].length / $scope.pageSize[index]);
      };

      $scope.previousFirstPage = function (index) {
         $scope.currentFirstPage[index] = ($scope.currentFirstPage[index] + $scope.numberOfFirstPages(index) - 1) % $scope.numberOfFirstPages(index);
         console.log($scope.currentFirstPage[index]);
      }

      $scope.nextFirstPage = function (index) {
         $scope.currentFirstPage[index] = ($scope.currentFirstPage[index] + 1) % $scope.numberOfFirstPages(index);
      }







      $scope.setCurrentSecondPage = function (index, currentPage) {
         $scope.currentSecondPage[index] = currentPage;
      }
      $scope.getCurrentSecondPage = function (index) {
         return $scope.currentSecondPage[index];
      }


      $scope.numberOfSecondPages = function (index) {
         return Math.ceil($scope.secondWordsFiltered[index].length / $scope.pageSize[index]);
      };

      $scope.previousSecondPage = function (index) {
         $scope.currentSecondPage[index] = ($scope.currentSecondPage[index] + $scope.numberOfSecondPages(index) - 1) % $scope.numberOfSecondPages(index);
      }

      $scope.nextSecondPage = function (index) {
         $scope.currentSecondPage[index] = ($scope.currentSecondPage[index] + 1) % $scope.numberOfSecondPages(index);
      }


// check if we are done!
      $scope.match = function() {
         return $scope.first != '' && $scope.first.length === $scope.second.length && $scope.firstUnmatched === '' && $scope.secondUnmatched === '';
      }


      // update unmatched letters and ask server for words from unmatched
      // letters
      $scope.update = function () {
         compare.update($scope);
      };



      //Add search controls
      angular.element(document).ready(function () {
         var markup, fn;
         for (i = 0; i < app.MAX_WORD_LENGTH - 1; i++) {
            markup = "<input class='input-sm firstFilter' placeholder='filter . . .' type='text' maxlength='" + app.MAX_WORD_LENGTH + "' size='" + app.MAX_WORD_LENGTH + "' ng-model='firstFilter" + i + "' />";
            angular.element('#firstPagination' + i).prepend($compile(markup)($scope));

            markup = "<input class='input-sm secondFilter' placeholder='filter . . .' type='text' maxlength='" + app.MAX_WORD_LENGTH + "' size='" + app.MAX_WORD_LENGTH + "' ng-model='secondFilter" + i + "' />";
            angular.element('#secondPagination' + i).prepend($compile(markup)($scope));

         }

         // avoid obvious clourse bug
         // Filter suggested words
         for (i = 0; i < app.MAX_WORD_LENGTH - 1; i++) {
            $scope.$watch('firstFilter' + i, (function (i) {
               return function (newTerm, oldTerm) {
                  if (newTerm !== oldTerm) {
                     $scope.firstWordsFiltered[i] = filterFilter($scope.firstWordsAll[i], newTerm);
                     $scope.firstWordsCount[i] = $scope.firstWordsFiltered[i].length;
                     $scope.currentFirstPage[i] = 0;
                  }
               };
            })(i));
            $scope.$watch('secondFilter' + i, (function (i) {
               return function (newTerm, oldTerm) {
                  if (newTerm !== oldTerm) {
                     $scope.secondWordsFiltered[i] = filterFilter($scope.secondWordsAll[i], newTerm);
                     $scope.secondWordsCount[i] = $scope.secondWordsFiltered[i].length;
                     $scope.currentSecondPage[i] = 0;
                  }
               };
            })(i));
         }//end of for
         


      });




   }]);
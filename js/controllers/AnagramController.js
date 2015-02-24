'use strict';

app.controller('AnagramController', ['$scope', '$sce', 'compare', function ($scope, $sce, compare) {
      var i, a, firstActive = 0, secondActive = 0;


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

      $scope.getFirst = function () {
         return 'active';
      }

      $scope.firstCount = 0;
      $scope.secondCount = 0;
      $scope.maxLetters = app.MAX_LETTERS;
      
      a = [];
      for (i = 0; i < app.MAX_WORD_LENGTH - 1; i++) {
         a.push(0);
      }
      $scope.firstWordsCount = a;
      a = [];
      for (i = 0; i < app.MAX_WORD_LENGTH - 1; i++) {
         a.push(0);
      }
      $scope.secondWordsCount = a;
      

      $scope.showFirst = function(index){
         return $scope.firstWordsAll[index].length !== 0;
      };
      $scope.showSecond = function(index){
         return $scope.secondWordsAll[index].length !== 0;
      };
      
      $scope.getFirstActive = function(index){
         return index === firstActive;
      }
      $scope.getSecondActive = function(index){
         return index === secondActive;
      }
      
      $scope.setFirstActive = function(index){
         firstActive = index;
      }
      $scope.setSecondActive = function(index){
         secondActive = index;
      }
      
      $scope.firstForward = function() {
         firstActive = (firstActive+1) % (app.MAX_WORD_LENGTH-1);
      }
      $scope.firstBack = function() {
         firstActive = (firstActive+app.MAX_WORD_LENGTH - 2) % (app.MAX_WORD_LENGTH-1);
      }
      
      $scope.secondForward = function() {
         secondActive = (secondActive+1) % (app.MAX_WORD_LENGTH-1);
      }
      $scope.secondBack = function() {
         secondActive = (secondActive+app.MAX_WORD_LENGTH - 2) % (app.MAX_WORD_LENGTH-1);
      }
      /*
       $scope.getHTMLFirst = function(index){
       return $sce.trustAsHtml($scope.firstWordsAll[index]);
       }
       
       $scope.getHTMLSecond = function(index){
       return $sce.trustAsHtml($scope.secondWordsAll[index]);
       }
       
       
       
       $scope.wordClick = function(e){
       alert('hello');
       var target = (e.target) ? e.target : e.srcElement;
       alert(target.text());
       
       }*/

      $scope.update = function () {
         compare.update($scope);
      };
   }]);
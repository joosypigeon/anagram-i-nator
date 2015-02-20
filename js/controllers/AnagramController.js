'use strict';

app.controller('AnagramController',
  function($scope){
    var firstPhrase = $('#firstPhrase'),
      firstUnmatched = $('#firstUnmatched').height(60),
      secondPhrase=$('#secondPhrase'),
      secondUnmatched=$('#secondUnmatched').height(60);
      
    
 
    $scope.first = '';
    $scope.second = '';
    
    $scope.firstUnmatchedValue = '';
    $scope.secondUnmatchedValue = '';
    
    var aphabetCount = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        aCharCode = 'a'.charCodeAt(0),
        alphabet = 'abcdefghijklmnopqrstuvwxyz',
        firstUnmatchedValue = '',
        secondUnmatchedValue = '';
    
    $scope.update = function(){
      
      firstUnmatchedValue = '';
      secondUnmatchedValue = '';
      
      for(var i = 0; i < 26; i++) {
        aphabetCount[i] = 0;
      }

      $scope.first.toLowerCase().split('').filter(function(x){return 'a' <= x && x <= 'z'}).map(function(x){return x.charCodeAt(0) - aCharCode}).forEach(function(x){aphabetCount[x]+=1;});
      
      $scope.second.toLowerCase().split('').filter(function(x){return 'a' <= x && x <= 'z'}).map(function(x){return x.charCodeAt(0) - aCharCode}).forEach(function(x){aphabetCount[x]-=1;});
      
      aphabetCount.forEach(function(x,i){
          var result = '';
        
          while(x!==0){
            if (x > 0) {
              firstUnmatchedValue += (alphabet[i] + ' ');
              x -= 1;
            } else if (x < 0) {
              secondUnmatchedValue += (alphabet[i] + ' ');
              x += 1;
            }
          }
        });
      
      firstUnmatched.text(firstUnmatchedValue);
      secondUnmatched.text(secondUnmatchedValue);
    }
});
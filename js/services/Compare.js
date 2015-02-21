'use strict';

app.factory('compare', function(){
    var aphabetCount = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        aCharCode = 'a'.charCodeAt(0),
        alphabet = 'abcdefghijklmnopqrstuvwxyz',
        firstUnmatchedValue = '',
        secondUnmatchedValue = '';

   return {
      update: function (firstPhrase, secondPhrase, firstUnmatched, secondUnmatched) {
         firstUnmatchedValue = '';
         secondUnmatchedValue = '';
         
         for(var i = 0; i < 26; i++) {aphabetCount[i] = 0;}
         
         firstPhrase.toLowerCase().split('').filter(function(x){return 'a' <= x && x <= 'z'}).map(function(x){return x.charCodeAt(0) - aCharCode}).forEach(function(x){aphabetCount[x]+=1;});
         secondPhrase.toLowerCase().split('').filter(function(x){return 'a' <= x && x <= 'z'}).map(function(x){return x.charCodeAt(0) - aCharCode}).forEach(function(x){aphabetCount[x]-=1;});

         aphabetCount.forEach(function(x,i){
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
   };
});
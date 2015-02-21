'use strict';

app.factory('compare', [ 'anagramData', '$interval', function(anagramData, $interval){
    var aphabetCount = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        aCharCode = 'a'.charCodeAt(0),
        alphabet = 'abcdefghijklmnopqrstuvwxyz',
        firstUnmatched = '',
        secondUnmatched = '',
        firstUnmatchedWithSpaces = '',
        secondUnmatchedWithSpaces = '',
        first, second;

   return {
      update: function update (s) {
         firstUnmatched = '',
         secondUnmatched = '',
         firstUnmatchedWithSpaces = '';
         secondUnmatchedWithSpaces = '';

         findUnmatched();
         
         if(!s.waiting){
            s.waiting = true;
            anagramData.getAnagrams(firstUnmatched, secondUnmatched, updateWords, errorCb);
         } else if (!s.pending) {
            s.pending = true;
            alert('pending!');
            $interval(function(){
            alert('doing it!');
               s.waiting = false;
               s.pending = false;
               update(s);
            },1000, 1);
         }
         
         function findUnmatched(){
            first = s.first.toLowerCase().split('').filter(function(x){return 'a' <= x && x <= 'z'}).join('');
            second = s.second.toLowerCase().split('').filter(function(x){return 'a' <= x && x <= 'z'}).join('');

            for(var i = 0; i < 26; i++) {aphabetCount[i] = 0;}

            s.first.toLowerCase().split('').filter(function(x){return 'a' <= x && x <= 'z'}).map(function(x){return x.charCodeAt(0) - aCharCode}).forEach(function(x){aphabetCount[x]+=1;});
            s.second.toLowerCase().split('').filter(function(x){return 'a' <= x && x <= 'z'}).map(function(x){return x.charCodeAt(0) - aCharCode}).forEach(function(x){aphabetCount[x]-=1;});

            aphabetCount.forEach(function(x,i){
                while(x!==0){
                  if (x > 0) {
                     firstUnmatched += alphabet[i];
                     firstUnmatchedWithSpaces += (alphabet[i] + ' ');
                    x -= 1;
                  } else if (x < 0) {
                     secondUnmatched += alphabet[i];
                     secondUnmatchedWithSpaces += (alphabet[i] + ' ');
                    x += 1;
                  }
                }
              });

            s.firstUnmatched = firstUnmatchedWithSpaces;
            s.secondUnmatched = secondUnmatchedWithSpaces;
         }
         
         function updateWords (data){
            var wordsA = data.phraseA.join(' '), wordsB = data.phraseB.join(' ');
            
            s.firstWords = wordsA;
            s.secondWords = wordsB;
            
            s.waiting = false;
         }
         
         function errorCb() {s.waiting = false;}
      }
   };
}]);
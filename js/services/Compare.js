'use strict';

app.factory('compare', [ 'anagramData', '$timeout', function(anagramData, $timeout){
   var aphabetCount = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
       aCharCode = 'a'.charCodeAt(0),
       alphabet = 'abcdefghijklmnopqrstuvwxyz',
       firstUnmatched = '',
       secondUnmatched = '',
       firstUnmatchedWithSpaces = '',
       secondUnmatchedWithSpaces = '',
       first, second,
       waiting = false, pending = false, count;
        
   var timeStamp = new Date().getTime();

   return {
      update: function update (s) {
//console.log('update:start');
         firstUnmatched = '',
         secondUnmatched = '',
         firstUnmatchedWithSpaces = '';
         secondUnmatchedWithSpaces = '';

         findUnmatched();
         
         if(!waiting){
//console.log('setting waiting true');
            waiting = true;
            anagramData.getAnagrams(new Date().getTime(), firstUnmatched, secondUnmatched, updateWords, errorCb);
         } else if (!pending) {
            pending = true;
//console.log('setting pending true');
            $timeout(function(){
//console.log('interval firing: waiting and pending false');
               waiting = false;
               pending = false;
               update(s);
            },1000);
         } else {
            //console.log('both waiting and pending are true');
         }
//console.log('update:end');
         function findUnmatched(){
            var count = 0, isLetter;

            first = s.first.toLowerCase().split('').filter(letterFilter).join('');
            if(count > app.MAX_LETTERS){
               s.first = first;
            }
            count = 0;
            second = s.second.toLowerCase().split('').filter(letterFilter).join('');
            if(count > app.MAX_LETTERS){
               s.second = second;
            }
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
            function letterFilter(x,i){               
               isLetter = 'a' <= x && x <= 'z';
               if(isLetter){
                  count++;
               }
               return isLetter && count <= app.MAX_LETTERS;
            }
         }
         
         function updateWords (time, data){
            var wordsA = data.phraseA.join(' '), wordsB = data.phraseB.join(' ');
            
//console.log('updateWords:timeStamp:'+timeStamp);
//console.log('updateWords:time:'+time);

            if(timeStamp > time){
//console.log('timeStamp is after time!!! ');
            } else {
               timeStamp = time;
               s.firstWords = wordsA;
               s.secondWords = wordsB;
            }

            waiting = false;
            
//console.log('updateWords:'+time+':waiting false');
//console.log('updateWords:'+time+':myThing:'+data.myThing);

         }
         
         function errorCb() {
//console.log('errorCb:waiting false');
            waiting = false;
         }
      }
   };
}]);
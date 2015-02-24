'use strict';

app.factory('compare', ['anagramData', '$timeout', function (anagramData, $timeout) {
      var aphabetCount = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
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
         update: function update(s) {
//console.log('update:start');
            firstUnmatched = '',
            secondUnmatched = '',
            firstUnmatchedWithSpaces = '';
            secondUnmatchedWithSpaces = '';

            findUnmatched();

            if (!waiting) {
//console.log('setting waiting true');
               waiting = true;
               anagramData.getAnagrams(new Date().getTime(), firstUnmatched, secondUnmatched, updateWords, errorCb);
            } else if (!pending) {
               pending = true;
//console.log('setting pending true');
               $timeout(function () {
//console.log('interval firing: waiting and pending false');
                  waiting = false;
                  pending = false;
                  update(s);
               }, 1000);
            } else {
               //console.log('both waiting and pending are true');
            }
//console.log('update:end');
            function findUnmatched() {
               var count = 0, isLetter;

               first = s.first.toLowerCase().split('').filter(strictLetterFilter).join('');
               if (count > app.MAX_LETTERS) {
                  count = 0;
                  s.first = s.first.split('').filter(lengthFilter).join('');
                  count = app.MAX_LETTERS;
               }
               s.firstCount = count;
               
               count = 0;
               second = s.second.toLowerCase().split('').filter(strictLetterFilter).join('');
               if (count > app.MAX_LETTERS) {
                  count = 0;
                  s.second = s.second.split('').filter(lengthFilter).join('');
                  count = app.MAX_LETTERS;
               }
               s.secondCount = count;
               
               
               for (var i = 0; i < 26; i++) {
                  aphabetCount[i] = 0;
               }

               s.first.toLowerCase().split('').filter(function (x) {
                  return 'a' <= x && x <= 'z'
               }).map(function (x) {
                  return x.charCodeAt(0) - aCharCode
               }).forEach(function (x) {
                  aphabetCount[x] += 1;
               });
               s.second.toLowerCase().split('').filter(function (x) {
                  return 'a' <= x && x <= 'z'
               }).map(function (x) {
                  return x.charCodeAt(0) - aCharCode
               }).forEach(function (x) {
                  aphabetCount[x] -= 1;
               });

               aphabetCount.forEach(function (x, i) {
                  while (x !== 0) {
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
               function strictLetterFilter(x, i) {
                  isLetter = 'a' <= x && x <= 'z';
                  if (isLetter) {
                     count++;
                  }
                  return isLetter && count <= app.MAX_LETTERS;
               }
               function lengthFilter(x) {
                  isLetter = ('a' <= x && x <= 'z') || ('A' <= x && x <= 'B');
                  if (isLetter) {
                     count++;
                  }
                  return !isLetter || (count <= app.MAX_LETTERS && isLetter);
               }
            }

            function updateWords(time, data) {
               var str, wordsA = data.phraseA.map(function (ws) {
                  return ws.sort().join(' ');
               }),
                       wordsB = data.phraseB.map(function (ws) {
                          return ws.sort().join(' ');
                       });

               console.log('wordsA[0]:"' + wordsA[0] + '"');
               if (wordsA[0] === '') {
                  wordsA.shift();
               } else {
                  str = wordsA[0] + ' ' + wordsA[1];
                  wordsA.shift();
                  wordsA.shift();
                  wordsA.unshift(str);
               }

               if (wordsB[0] === '') {
                  wordsB.shift();
               } else {
                  str = wordsB[0] + ' ' + wordsB[1];
                  wordsB.shift();
                  wordsB.shift();
                  wordsB.unshift(str);
               }

               //console.log(data.phraseA);
               //console.log(wordsA);
               //console.log('updateWords:timeStamp:' + timeStamp);
               //console.log('updateWords:time:' + time);

               if (timeStamp > time) {
//console.log('timeStamp is after time!!! ');
               } else {
                  timeStamp = time;
                  s.firstWordsAll = wordsA;
                  s.secondWordsAll = wordsB;
               }

               waiting = false;

//console.log('updateWords:'+time+':waiting false');


            }


            function errorCb() {
//console.log('errorCb:waiting false');
               waiting = false;
            }
         }
      };
   }]);
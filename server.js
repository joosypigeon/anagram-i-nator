'use strict';

(function () {
   var MAX_LENGTH = 53,
           MAX_WORD_LENGTH = 15;

   try {
      console.log('loading dictionary');
      var fs = require('fs');

      fs.readFile('dic-enable2k.txt', 'utf8', function (e, data) {
         if (!e) {
            // load dictionary
            var root = buildTrie(data);
            console.log('finished loading dictionary');

            console.log('starting server');
            var express = require('express'),
                    app = express();

            app.use('/data/:letters', function (req, res) {
               var letters = req.params.letters, words;
               if (badLetters(letters)) {
                  res.status(400).json({status: 'bad request'});
               } else {
                  words = getWords(root, letters);
 
                  res.status(200).json({status: 'good request', 'words': words});
               }
               res.end();
            });

            app.use('/js', express.static(__dirname + '/js'));
            app.use('/css', express.static(__dirname + '/css'));
            app.get('/', function (req, res) {
               res.sendFile(__dirname + '/index.html');
            });

            app.get('/*', function (req, res) {
               res.status(404).json({status: 'not found'});
            });

            app.listen(80);
            console.log('server started');
         } else {
            console.log(catchToString(e));
            throw e;
         }
      });
   } catch (e) {
      console.log(catchToString(e));
   }

   ///////////////////////
   //inner function below
   ///////////////////////

   function sleep(miliseconds) {
      var currentTime = new Date().getTime();

      while (currentTime + miliseconds >= new Date().getTime()) {
      }
   }

   function catchToString(err) {
      var errInfo = "Error:\n";
      for (var prop in err) {
         if (err.hasOwnProperty(prop)) {
            errInfo += "  property: " + prop + "\n    value: [" + err[prop] + "]\n";
         }
      }
      errInfo += "  toString(): " + " value: [" + err.toString() + "]";
      return errInfo;
   }

   function buildTrie(data) {
      var root = [null, [[], []]], line, lines, word, words, length, currentNode,
              currentEdgeList, currentLetters, currentChildNodes,
              currentIndex, lc;

      lc = 0;
      lines = data.split(/[\r\n]+/);
      lines.forEach(function (line) {
         lc++;
         if (lc % 10000 === 0) {
            console.log(lc);
         }
         words = line.split(/[\s]+/);
         word = words.shift();
         length = word.length;
         currentNode = root;
         word.split('').forEach(function (x, i) {
            currentEdgeList = currentNode[1];
            currentLetters = currentEdgeList[0];
            currentChildNodes = currentEdgeList[1];
            currentIndex = currentLetters.indexOf(x);
            if (currentIndex === -1) {
               currentNode = [null, [[], []]];
               currentLetters.push(x);
               currentChildNodes.push(currentNode);
            } else {
               currentNode = currentChildNodes[currentIndex];
            }
            if (i === length - 1) {
               // currentNode is now updated to what x points to
               // x is the last letter than store word in anagram array of currentNode
               currentNode[0] = words;
            }
         });// end of word.split('').forEach
      });// end of lines.forEach
      console.log(lc);
      return root;
   }

   function badLetters(letters) {
      var bad = false;

      if (letters.length > MAX_LENGTH) {
         bad = true;
      } else if (letters.length > 0) {
         letters.split('').map(function (x) {
            bad = bad || (x < 'a' && 'z' < x);
         });
      }

      return bad;
   }



   function getWords(root, letters) {
      var currentIndex, currentNode, words, currentEdgeList, currentLetters,
              currentChildNodes, letter, letterIndex, indices = [], index = [], max = [],
              cumulative = [], alphebet = 'abcdefghijklmnopqrstuvwxyz',
              aphabetCount = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
              numberIndices, ii, wordArray, letterIndex,
              aCharCode = 'a'.charCodeAt(0), zCharCode = 'z'.charCodeAt(0),
              found = [], arrayOfWordLength = [], good, nodes = [], i;


      for (i = 0; i < MAX_WORD_LENGTH; i++) {
         found.push([]);
      }

      for (i = 0; i < 26; i++) {
         aphabetCount[i] = 0;
      }


      letters.toLowerCase().split('').map(function (x) {
         return x.charCodeAt(0) - aCharCode;
      }).forEach(function (x) {
         aphabetCount[x] += 1;
      });//get the signature of LETTERS


      aphabetCount.forEach(function (x, i) {
         if (x) {
            indices.push(i);
         }
      });// record the non-zero signature elements of LETTERS

      indices.forEach(function (i) {
         cumulative.push(0);
         index.push(0);
         max.push(aphabetCount[i] + 1);
      }); // create loop varaiable with max values


      currentIndex = 0;
      numberIndices = indices.length;

      // iterate over power set
      currentNode = root;
      nodes.push(currentNode);
      while (index[0] < max[0]) {
         if (index[currentIndex] < max[currentIndex] && cumulative[currentIndex] < MAX_WORD_LENGTH + 1) {
            if (0 < index[currentIndex]) {

               currentNode = nodes[currentIndex];
               currentEdgeList = currentNode[1];
               currentLetters = currentEdgeList[0];
               letter = alphebet[indices[currentIndex]];
               letterIndex = currentLetters.indexOf(letter);
               if (letterIndex === -1) {
                  // This prefix does not exist in anagram dictionary trie.
                  // abandon loop
                  // step out to outter loop
                  if (currentIndex === 0) {
                     break;
                  }
                  index[currentIndex] = 0;
                  cumulative[currentIndex] = 0;
                  currentIndex -= 1;
                  index[currentIndex] += 1;
                  cumulative[currentIndex] += 1;
                  continue;
               }

               currentChildNodes = currentEdgeList[1];
               currentNode = currentChildNodes[letterIndex];
               nodes[currentIndex] = currentNode;
            }

            if (currentIndex === numberIndices - 1) {
               // increment innermost loop

               words = currentNode[0];
               if (words) {
                  found[cumulative[currentIndex] - 1] = found[cumulative[currentIndex] - 1].concat(words);
               }
               // increment inner most loop
               index[numberIndices - 1] += 1;
               cumulative[numberIndices - 1] += 1;
            } else {
               // step into next inner loop
               currentIndex += 1;
               cumulative[currentIndex] = cumulative[currentIndex - 1];
               nodes[currentIndex] = nodes[currentIndex - 1];
            }
         } else if (currentIndex !== 0) {
            // step out to outter loop
            index[currentIndex] = 0;
            cumulative[currentIndex] = 0;
            currentIndex -= 1;
            index[currentIndex] += 1;
            cumulative[currentIndex] += 1;
         }
      }
      return found;
   }


})();


'use strict';

(function(){
   var MAX_LENGTH = 53;
   
   try{
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

            app.use('/data/:letters', function(req, res){
               console.log('----------------');
               var letters = req.params.letters,
                  index = letters.indexOf('-'),
                  anagramsA, anagramsB, lettersA, lettersB;
               console.log('letters:'+letters) 
               console.log('index:'+index);
               if(index === 0){
                  lettersA = '';
                  lettersB = letters.slice(1);
               } else if (index === letters.length - 1) {
                  lettersA = letters.slice(0,index);
                  lettersB = '';
               } else {
                  lettersA = letters.slice(0,index );
                  lettersB = letters.slice(index + 1,letters.length - 1)
               }

               console.log('lettersA:"'+lettersA+'"');
               console.log('lettersB:"'+lettersB+'"');

               if(index === -1 || badLetters(lettersA) || badLetters(lettersB)){
                   res.status(400).json({status: 'bad request'});
               } else {
                  anagramsA = getAnagrams(root, lettersA);
                  anagramsB = getAnagrams(root, lettersB);
                  
                  res.status(200).json({status: 'good request', phraseA: anagramsA, phraseB: anagramsB});
               }
               console.log('----------------');
               res.end();
            });

            app.use('/js', express.static(__dirname+'/js'));
            app.use('/css', express.static(__dirname+'/css'));
            app.get('/', function(req, res){
               res.sendFile(__dirname + '/index.html');
            });

            app.get('/*', function  (req, res) {
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
   
   function buildTrie(data){
      var root = [null,[[],[]]], line, lines, word, words, length, currentNode,
         currentEdgeList, currentLetters, currentChildNodes,
         currentIndex, lc;

      lc = 0;
      lines = data.split(/[\r\n]+/);
      lines.forEach(function(line){
         lc++;
         if (lc % 10000 === 0) { console.log(lc); }
         //console.log('line:'+line);
         words = line.split(/[\s]+/);
         word = words.shift();
         //console.log('word:'+word);
         length = word.length;
         currentNode = root;
         word.split('').forEach(function(x,i){
            //console.log('letter:'+x);
            currentEdgeList   = currentNode[1];
            currentLetters    = currentEdgeList[0];
            currentChildNodes = currentEdgeList[1];
            currentIndex = currentLetters.indexOf(x);
            if(currentIndex===-1){
              //console.log('letter edge not found from this node');
              currentNode = [null,[[],[]]];
              currentLetters.push(x);
              currentChildNodes.push(currentNode);
            } else {
              //console.log('found letter edge');
              currentNode = currentChildNodes[currentIndex];
            }
            if(i===length-1){
              // currentNode is now updated to what x points to
              // x is the last letter than store word in anagram array of currentNode
              //console.log('last letter of key');
              //console.log('setting anagram array:'+words);
              currentNode[0] = words;
            }
            //console.log('---');
         });// end of word.split('').forEach
      });// end of lines.forEach
      console.log(lc);
      return root;
   }

   function badLetters(letters) {
      var bad = false;

      if(letters.length > MAX_LENGTH) {
         bad = true;
      } else if (letters.length > 0){
         letters.split('').map(function(x){bad = bad || ( x < 'a' && 'z' < x)});
      }

      return bad;
   }
   
   

   function getAnagrams(root, letters){
      var currentIndex, currentNode, words, currentEdgeList, currentLetters,
        currentChildNodes, letter, letterIndex, indices = [], index = [], max = [],
        cumulative = [], alphebet = 'abcdefghijklmnopqrstuvwxyz', 
        aphabetCount = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        numberIndices, ii, wordArray, letterIndex,
        aCharCode = 'a'.charCodeAt(0), zCharCode = 'z'.charCodeAt(0),
        found = [], arrayOfWordLength=[], good, nodes = [];

      for(var i = 0; i < 26; i++) { aphabetCount[i] = 0; }

      //console.log(aphabetCount.join(''));

      letters.toLowerCase().split('').map(function(x){return x.charCodeAt(0) - aCharCode}).forEach(function(x){aphabetCount[x]+=1;});//get the signature of LETTERS

      //console.log(aphabetCount.join(''));
      //console.log('abcdefghijklmnopqrstuvwxyz');

      aphabetCount.forEach(function(x,i){if(x){indices.push(i);}});// record the non-zero signature elements of LETTERS

      //console.log('indices:'+indices);

      indices.forEach(function(i){cumulative.push(0); index.push(0); max.push(aphabetCount[i]+1);}); // create loop varaiable with max values

      //console.log('max:'+max);

      currentIndex = 0;
      numberIndices = indices.length;

      //console.log('root[0]:'+root[0]);
      //console.log('root[1][0]:'+root[1][0]);
      //console.log('root[1][1]:'+root[1][1]);

      // iterate over power set

      currentNode = root;
      nodes.push(currentNode);
      while(index[0]<max[0]){
//console.log('currentIndex:'+currentIndex);
//console.log('index:'+index);
//console.log('cumulative:'+cumulative);


        if(index[currentIndex]<max[currentIndex] && cumulative[currentIndex] < 27) {
          if(0 < index[currentIndex]){

            currentNode = nodes[currentIndex];
            currentEdgeList = currentNode[1];
            currentLetters = currentEdgeList[0];
            letter = alphebet[indices[currentIndex]];
//console.log(' adding another letter:'+letter);
            letterIndex = currentLetters.indexOf(letter);
            if(letterIndex === -1) {
//console.log('no edge found');
              // This prefix does not exist in anagram dictionary trie.
              // abandon loop
//console.log('stepping out to outter loop');
              // step out to outter loop
              if(currentIndex === 0) {
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

          if(currentIndex === numberIndices - 1) {
//console.log('innermost loop');
            // increment innermost loop

            words = currentNode[0];
            if(words){
//console.log('words:' + words);
              found = found.concat(words);
            }
            // increment inner most loop
//console.log('increment inner most loop');
            index[numberIndices - 1] += 1;
            cumulative[numberIndices - 1] += 1;
            } else {
//console.log('stepping into next inner loop');
            // step into next inner loop
              currentIndex += 1;
              cumulative[currentIndex] = cumulative[currentIndex-1];
              nodes[currentIndex] = nodes[currentIndex-1];
            }
          } else if (currentIndex !== 0) {
//console.log('stepping out to outter loop');
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


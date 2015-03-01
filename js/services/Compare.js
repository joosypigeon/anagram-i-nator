'use strict';

app.factory('compare', ['wordData', '$timeout', 'filterFilter', function (wordData, $timeout, filterFilter) {
        var aphabetCount = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                aCharCode = 'a'.charCodeAt(0),
                alphabet = 'abcdefghijklmnopqrstuvwxyz',
                firstUnmatched = '',
                secondUnmatched = '',
                first, second,
                waiting = {'first': false, 'second': false},
        pending = {'first': false, 'second': false},
        count, isLetter;

        var timeStamp = {'first': new Date().getTime(), 'second': new Date().getTime()};

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

        return {
            updateUnmatched: function (scope) {
                firstUnmatched = '';
                secondUnmatched = '';

                count = 0;
                first = scope.first.toLowerCase().split('').filter(strictLetterFilter).join('');
                if (count > app.MAX_LETTERS) {
                    count = 0;
                    scope.first = scope.first.split('').filter(lengthFilter).join('');
                    count = app.MAX_LETTERS;
                }
                scope.firstCount = count;

                count = 0;
                second = scope.second.toLowerCase().split('').filter(strictLetterFilter).join('');
                if (count > app.MAX_LETTERS) {
                    count = 0;
                    scope.second = scope.second.split('').filter(lengthFilter).join('');
                    count = app.MAX_LETTERS;
                }
                scope.secondCount = count;


                for (var i = 0; i < 26; i++) {
                    aphabetCount[i] = 0;
                }

                scope.first.toLowerCase().split('').filter(function (x) {
                    return 'a' <= x && x <= 'z';
                }).map(function (x) {
                    return x.charCodeAt(0) - aCharCode;
                }).forEach(function (x) {
                    aphabetCount[x] += 1;
                });
                scope.second.toLowerCase().split('').filter(function (x) {
                    return 'a' <= x && x <= 'z';
                }).map(function (x) {
                    return x.charCodeAt(0) - aCharCode;
                }).forEach(function (x) {
                    aphabetCount[x] -= 1;
                });

                aphabetCount.forEach(function (x, i) {
                    while (x !== 0) {
                        if (x > 0) {
                            firstUnmatched += alphabet[i];
                            x -= 1;
                        } else if (x < 0) {
                            secondUnmatched += alphabet[i];
                            x += 1;
                        }
                    }
                });

                scope.firstUnmatched = firstUnmatched;
                scope.secondUnmatched = secondUnmatched;
            },
            updateWords: function updateWords(scope, firstOrSecond) {
                var unmatched = (firstOrSecond === 'first' ? firstUnmatched : secondUnmatched), i;

                if (!waiting[firstOrSecond]) {
                    if (unmatched !== '') {
                        waiting[firstOrSecond] = true;
                        wordData.getWords(new Date().getTime(), unmatched, successCb, errorCb);
                    } else {
                        scope[firstOrSecond + 'Unmatched'] = '';
                        for (i = 0; i < app.MAX_WORD_LENGTH - 1; i++) {
                            scope[firstOrSecond + 'WordsAll'][i] = [];
                            scope[firstOrSecond + 'WordsFiltered'][i] = [];
                        }
                    }
                } else if (!pending[firstOrSecond]) {
                    pending[firstOrSecond] = true;
                    $timeout(function () {
                        pending[firstOrSecond] = false;
                        updateWords(scope, firstOrSecond);
                    }, 100);
                }

                // inner functions bellow
                // callbacks for wordData.getWords
                function successCb(time, data) {
                    var a, words = data.words, i;

                    if (words[0].length === 0) {
                        words.shift();
                    } else {
                        a = words[0].concat(words[1]);
                        words.shift();
                        words.shift();
                        words.unshift(a);
                    }

                    if (timeStamp[firstOrSecond] < time) { // sanity check
                        timeStamp[firstOrSecond] = time;
                        scope[firstOrSecond + 'WordsAll'] = words;
                        for (i = 0; i < app.MAX_WORD_LENGTH - 1; i++) {
                            scope[firstOrSecond + 'Filter' + i] = '';
                            scope[firstOrSecond + 'WordsFiltered'][i] = scope[firstOrSecond + 'WordsAll'][i].map(function (w) {
                                return w;
                            });
                            scope[firstOrSecond + 'WordsCount'][i] = scope[firstOrSecond + 'WordsFiltered'][i].length;
                        }

                        //reset paganation
                        for (i = 0; i < app.MAX_WORD_LENGTH - 1; i++) {
                            scope[firstOrSecond + 'CurrentPage'][i] = 0;
                        }
                    }

                    waiting[firstOrSecond] = false;
                }

                function errorCb() {
                    waiting[firstOrSecond] = false;
                }
            }

        };
    }]);
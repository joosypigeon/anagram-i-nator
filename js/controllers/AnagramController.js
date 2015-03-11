'use strict';

app.controller('AnagramController', ['$scope', 'filterFilter', 'compare', 'MAX_WORD_LENGTH', 'MAX_LETTERS', function ($scope, filterFilter, compare, MAX_WORD_LENGTH, MAX_LETTERS) {
    var i, a, b, c, firstActive = 0,
        secondActive = 0;
    $('#firstUnmatched').height(60);
    $('#secondUnmatched').height(60);

    $scope.maxWordLength = MAX_WORD_LENGTH;

    $scope.wordsTitle = ['words of length 1 and 2', 'words of length 3', 'words of length 4', 'words of length 5', 'words of length 6', 'words of length 7', 'words of length 8', 'words of length 9', 'words of length 10', 'words of length 11', 'words of length 12', 'words of length 13', 'words of length 14', 'words of length 15'];


    $scope.first = '';
    $scope.firstUnmatched = '';
    $scope.firstUnmatchedWithSpaces = '';
    a = [];
    b = [];
    c = [];
    for (i = 0; i < MAX_WORD_LENGTH - 1; i += 1) {
        a.push([]);
        b.push(0);
        c.push('');
    }
    $scope.firstWordsAll = a;
    $scope.firstWordsFiltered = a;
    $scope.firstWordsCount = b;
    $scope.firstFilterArray = c;

    $scope.second = '';
    $scope.secondUnmatched = '';
    $scope.secondUnmatchedWithSpaces = '';
    a = [];
    b = [];
    c = [];
    for (i = 0; i < MAX_WORD_LENGTH - 1; i += 1) {
        a.push([]);
        b.push(0);
        c.push('');
    }
    $scope.secondWordsAll = a;
    $scope.secondWordsFiltered = a;
    $scope.secondWordsCount = b;
    $scope.secondFilterArray = c;




    $scope.firstCount = 0;
    $scope.secondCount = 0;
    $scope.maxLetters = MAX_LETTERS;

    $scope.setFirst = function (str) {
        $scope.first = str;
    };
    $scope.setSecond = function (str) {
        $scope.second = str;
    };

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
        firstActive = (firstActive + 1) % (MAX_WORD_LENGTH - 1);
    };
    $scope.firstBack = function () {
        firstActive = (firstActive + MAX_WORD_LENGTH - 2) % (MAX_WORD_LENGTH - 1);
    };

    $scope.secondForward = function () {
        secondActive = (secondActive + 1) % (MAX_WORD_LENGTH - 1);
    };
    $scope.secondBack = function () {
        secondActive = (secondActive + MAX_WORD_LENGTH - 2) % (MAX_WORD_LENGTH - 1);
    };

    // Pagination
    $scope.firstCurrentPage = [];
    for (i = 0; i < MAX_WORD_LENGTH - 1; i += 1) {
        $scope.firstCurrentPage.push(0);
    }
    $scope.secondCurrentPage = [];
    for (i = 0; i < MAX_WORD_LENGTH - 1; i += 1) {
        $scope.secondCurrentPage.push(0);
    }

    // HACK for pagination
    $scope.pageSize = [100, 120, 90, 70, 60, 55, 50, 45, 40, 35, 30, 30, 30, 30];





    $scope.setCurrentFirstPage = function (index, currentPage) {
        $scope.firstCurrentPage[index] = currentPage;
    };
    $scope.getCurrentFirstPage = function (index) {
        return $scope.firstCurrentPage[index];
    };


    $scope.numberOfFirstPages = function (index) {
        return Math.ceil($scope.firstWordsFiltered[index].length / $scope.pageSize[index]);
    };

    $scope.previousFirstPage = function (index) {
        $scope.firstCurrentPage[index] = ($scope.firstCurrentPage[index] + $scope.numberOfFirstPages(index) - 1) % $scope.numberOfFirstPages(index);
    };

    $scope.nextFirstPage = function (index) {
        $scope.firstCurrentPage[index] = ($scope.firstCurrentPage[index] + 1) % $scope.numberOfFirstPages(index);
    };


    $scope.setCurrentSecondPage = function (index, currentPage) {
        $scope.secondCurrentPage[index] = currentPage;
    };
    $scope.getCurrentSecondPage = function (index) {
        return $scope.secondCurrentPage[index];
    };


    $scope.numberOfSecondPages = function (index) {
        return Math.ceil($scope.secondWordsFiltered[index].length / $scope.pageSize[index]);
    };

    $scope.previousSecondPage = function (index) {
        $scope.secondCurrentPage[index] = ($scope.secondCurrentPage[index] + $scope.numberOfSecondPages(index) - 1) % $scope.numberOfSecondPages(index);
    };

    $scope.nextSecondPage = function (index) {
        $scope.secondCurrentPage[index] = ($scope.secondCurrentPage[index] + 1) % $scope.numberOfSecondPages(index);
    };


    // check if we are done!
    $scope.match = function () {
        function containsLetter(s) {
            var contains = false,
                char;
            for (i = 0; i < s.length; i += 1) {
                char = s.charAt(i);
                contains = contains || ('a' <= char && char <= 'z') || ('A' <= char && char <= 'B');
                if (contains) {
                    break;
                }
            }
            return contains;
        }

        return $scope.first !== '' && containsLetter($scope.first) && $scope.firstUnmatched === '' && $scope.secondUnmatched === '';
    };


    // avoid obvious clourse bug
    // Filter suggested words
    function filterCB(firstOrSecond, i) {
        return function (newTerm, oldTerm) {
            if (newTerm !== oldTerm) {
                $scope[firstOrSecond + 'WordsFiltered'][i] = filterFilter($scope[firstOrSecond + 'WordsAll'][i], newTerm);
                $scope[firstOrSecond + 'WordsCount'][i] = $scope[firstOrSecond + 'WordsFiltered'][i].length;
                $scope[firstOrSecond + 'CurrentPage'][i] = 0;
            }
        };
    }
    for (i = 0; i < MAX_WORD_LENGTH - 1; i += 1) {
        $scope.$watch('firstFilterArray[' + i + ']', filterCB('first', i));
        $scope.$watch('secondFilterArray[' + i + ']', filterCB('second', i));
    } //end of for


    // ng-change call for first and second phrase
    // update unmatched letters
    $scope.updateUnmatched = function () {
        compare.updateUnmatched($scope);
    };



    // watch unmatched letters and update words made from them accordingliy
    $scope.$watch('firstUnmatched', function () {
        $scope.updateWords('first');
    });

    $scope.$watch('secondUnmatched', function () {
        $scope.updateWords('second');
    });

    //and ask server for words from unmatched letters
    $scope.updateWords = function (firstOrSecond) {
        compare.updateWords($scope, firstOrSecond);
    };
}]);
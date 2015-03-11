'use strict';

var app = angular.module('app', ['ui.bootstrap'])
        .constant('MAX_LETTERS', 26)
        .constant('MAX_WORD_LENGTH', 15);

app.MAX_LETTERS = 26;
app.MAX_WORD_LENGTH = 15;
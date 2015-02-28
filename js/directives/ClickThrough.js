'use strict';

app.directive('firstClickThrough', ['$timeout', function ($timeout) {
      return {
         restrict: 'A',
         link: function (scope, elements, attrs, controller) {
            elements.on('click', function (event) {
               $timeout(function () {
                  var target = getEventTarget(event);
                  if (target.innerHTML.length <= app.MAX_WORD_LENGTH) {
                     scope.setSecond(getText(target.innerHTML, 'secondPhrase'));
                     scope.updateUnmatched();
                  }
               });
            });
         }
      };
   }]);

app.directive('secondClickThrough', ['$timeout', function ($timeout) {
      return {
         restrict: 'A',
         link: function (scope, elements, attrs, controller) {
            elements.on('click', function (event) {
               $timeout(function () {
                  var target = getEventTarget(event);
                  if (target.innerHTML.length <= app.MAX_WORD_LENGTH) {
                     scope.setFirst(getText(target.innerHTML, 'firstPhrase'));
                     scope.updateUnmatched();
                  }
               });
            });
         }
      };
   }]);




function getEventTarget(e) {
   e = e || window.event;
   return e.target || e.srcElement;
}

function getText(text, id) {
   var returnText;
   var caretPos = document.getElementById(id).selectionStart;
   var textAreaTxt = jQuery("#" + id).val();
   if (caretPos === 0) {
      returnText = text + ' ' + textAreaTxt;
   } else if (caretPos === textAreaTxt.length) {
      returnText = textAreaTxt + ' ' + text;
   } else {
      returnText = textAreaTxt.substring(0, caretPos) + text + textAreaTxt.substring(caretPos);
   }
   return returnText;
}
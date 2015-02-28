'use strict';

app.directive('unmatched', function () {
   return {
      restrict: 'A',
      link: function (scope, elements, attrs, controller) {

         scope.$watch(attrs.firstOrSecond + 'Unmatched', function (newValue) {

            scope[attrs.firstOrSecond + 'UnmatchedWithSpaces'] = newValue.split('').join(' ');

         });
      }
   };
});

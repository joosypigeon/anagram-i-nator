'use strict';

app.directive('noReturn', function(){
   var items;
console.log('hello');
   return {
      restrict: 'A',
     link: function(scope, elements, attrs, controller){
        elements.on('keydown ', function(event){
           if(event.keyCode === 13){
              return false;
           } else {
              return true;
           }
         });
      }
   };
});
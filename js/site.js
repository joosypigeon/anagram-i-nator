'use strict';

function getEventTarget(e) {
    e = e || window.event;
    return e.target || e.srcElement; 
}

function clickThrough (event) {
    var target = getEventTarget(event);
    alert(target.innerHTML);
};


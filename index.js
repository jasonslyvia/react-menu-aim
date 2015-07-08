/**
 * react-menu-aim is a React Mixin heavily inspired by jQuery-menu-aim. All rights
 * reserved by the original author.
 *
 * https://github.com/jasonslyvia/react-menu-aim
 * https://github.com/kamens/jQuery-menu-aim
*/

var React = require('react/addons');
var MOUSE_LOCS_TRACKED = 3;  // number of past mouse locations to trackv
var DELAY = 300;       // ms delay when user appears to be entering submenu


/**
 *
 * DOM helpers
 *
 */
function on(el, eventName, callback) {
  if (el.addEventListener) {
    el.addEventListener(eventName, callback, false);
  }
  else if (el.attachEvent) {
    el.attachEvent('on'+eventName, function(e) {
      callback.call(el, e || window.event);
    });
  }
}

function off(el, eventName, callback) {
  if (el.removeEventListener) {
    el.removeEventListener(eventName, callback);
  }
  else if (el.detachEvent) {
    el.detachEvent('on'+eventName, callback);
  }
}

function offset(el) {
  if (!el) {
    return {
      left: 0,
      top: 0
    };
  }

  var rect = el.getBoundingClientRect();
  return {
    top: rect.top + document.body.scrollTop,
    left: rect.left + document.body.scrollLeft
  };
}

function outerWidth(el) {
  var _width = el.offsetWidth;
  var style = el.currentStyle || getComputedStyle(el);

  _width += (parseInt(style.marginLeft, 10) || 0);
  return _width;
}

function outerHeight(el) {
  var _height = el.offsetHeight;
  var style = el.currentStyle || getComputedStyle(el);

  _height += (parseInt(style.marginLeft, 10) || 0);
  return _height;
}



/**
 *
 * Util helpers
 *
 */
function getActivateDealy() {
  var menu = React.findDOMNode(this);
  var menuOffset = offset(menu);

  var upperLeft = {
    x: menuOffset.left,
    y: menuOffset.top
  };
  var upperRight = {
    x: menuOffset.left + outerWidth(menu),
    y: upperLeft.y
  };
  var lowerLeft = {
    x: offset.left,
    y: offset.top - outerHeight(menu)
  };
  var lowerRight = {
    x: offset.left + outerWidth(menu),
    y: lowerLeft.y
  };

  var loc = this._mouseLocs[this._mouseLocs.length - 1];
  var prevLoc = this._mouseLocs[0];

  if (!loc) {
    return 0;
  }

  if (!prevLoc) {
    prevLoc = loc;
  }

  // If the previous mouse location was outside of the entire
  // menu's bounds, immediately activate.
  if (prevLoc.x < menuOffset.left || prevLoc.x > lowerRight.x ||
      prevLoc.y < menuOffset.top || prevLoc.y > lowerRight.y
    ) {
    return 0;
  }

  // If the mouse hasn't moved since the last time we checked
  // for activation status, immediately activate.
  if (this._lastDelayDoc &&
        loc.x === this._lastDelayDoc.x && loc.y === this._lastDelayDoc.y) {
    return 0;
  }

  // Detect if the user is moving towards the currently activated
  // submenu.
  //
  // If the mouse is heading relatively clearly towards
  // the submenu's content, we should wait and give the user more
  // time before activating a new row. If the mouse is heading
  // elsewhere, we can immediately activate a new row.
  //
  // We detect this by calculating the slope formed between the
  // current mouse location and the upper/lower right points of
  // the menu. We do the same for the previous mouse location.
  // If the current mouse location's slopes are
  // increasing/decreasing appropriately compared to the
  // previous's, we know the user is moving toward the submenu.
  //
  // Note that since the y-axis increases as the cursor moves
  // down the screen, we are looking for the slope between the
  // cursor and the upper right corner to decrease over time, not
  // increase (somewhat counterintuitively).
  function slope(a, b) {
    return (b.y - a.y) / (b.x - a.x);
  }

  var decreasingCorner = upperRight;
  var increasingCorner = lowerRight;

  // Our expectations for decreasing or increasing slope values
  // depends on which direction the submenu opens relative to the
  // main menu. By default, if the menu opens on the right, we
  // expect the slope between the cursor and the upper right
  // corner to decrease over time, as explained above. If the
  // submenu opens in a different direction, we change our slope
  // expectations.
  if (this._submenuDirection === 'left') {
    decreasingCorner = lowerLeft;
    increasingCorner = upperLeft;
  }
  else if (this._submenuDirection === 'below') {
    decreasingCorner = lowerRight;
    increasingCorner = lowerLeft;
  }
  else if (this._submenuDirection === 'above') {
    decreasingCorner = upperLeft;
  }


  var decreasingSlope = slope(loc, decreasingCorner);
  var increasingSlope = slope(loc, increasingCorner);
  var prevDecreasingSlope = slope(prevLoc, decreasingCorner);
  var prevIncreasingSlope = slope(prevLoc, increasingCorner);

  // Mouse is moving from previous location towards the
  // currently activated submenu. Delay before activating a
  // new menu row, because user may be moving into submenu.
  if (decreasingSlope < prevDecreasingSlope && increasingSlope > prevIncreasingSlope) {
    this._lastDelayLoc = loc;
    return DELAY;
  }

  this._lastDelayLoc = null;
  return 0;
}


// For the concern of further changes might happen when activeRowIndex changes,
// this mixin doesn't setState directly, instead it calls the callback provided
// by user.
function activate(rowIdentifier, handler) {
  handler.call(this, rowIdentifier);
}


function possiblyActivate(rowIdentifier, handler) {
  var delay = getActivateDealy.call(this);

  if (delay) {
    var self = this;
    this.__reactMenuAimTimer = setTimeout(function(){
      possiblyActivate.call(self, rowIdentifier, handler);
    }, delay);
  }
  else {
    activate.call(this, rowIdentifier, handler);
  }
}



/**
 * @export
 */
module.exports = exports = {
  componentDidMount: function() {
    on(document, 'mousemove.react-menu-aim', this.handleMouseMoveDocument);
  },

  componentWillUnmount: function() {
    off(document, 'mousemove.react-menu-aim', this.handleMouseMoveDocument);
  },

  handleMouseMoveDocument: function(e) {
    var _mouseLocs = this._mouseLocs || [];
    _mouseLocs.push({
      x: e.pageX,
      y: e.pageY
    });

    if (_mouseLocs.length > MOUSE_LOCS_TRACKED) {
      _mouseLocs.shift();
    }

    this._mouseLocs = _mouseLocs;
  },

  /**
   * @param  {object}   e     React's synthetic event object
   * @param  {function} handler The true event handler for your app
   */
  handleMouseLeaveMenu: function(e, handler) {
    if (this.__reactMenuAimTimer) {
      clearTimeout(this.__reactMenuAimTimer);
    }

    if (typeof handler === 'function') {
      handler.call(this, e);
    }
  },

  /**
   * @param  {number}   rowIdentifier  The identifier of current row, ie. index or name
   * @param  {function} handler        The true event handler for your app
   * @param  {object}   e              React's synthetic event object
   */
  handleMouseEnterRow: function(rowIdentifier, handler) {
    if (this.__reactMenuAimTimer) {
      clearTimeout(this.__reactMenuAimTimer);
    }

    possiblyActivate.call(this, rowIdentifier, handler);
  }
};



import {on, off, handleMouseMoveDocument, activate, getActivateDelay, menuAimModel} from './src/core.js';


function possiblyActivate(rowIdentifier, handler, config) {
  var delay = getActivateDelay.call(this, config);

  if (delay) {
    var self = this;
    this.__reactMenuAimTimer = setTimeout(function(){
      possiblyActivate.call(self, rowIdentifier, handler, config);
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
  initMenuAim: function(options) {
    this.__reactMenuAimConfig = options;
  },

  __getMouseMoveDocumentHandler: function() {
    if (!this.__mouseMoveDocumentHandler) {
      this.__mouseMoveDocumentHandler = handleMouseMoveDocument.bind(this);
    }

    return this.__mouseMoveDocumentHandler;
  },

  componentDidMount: function() {
    if (menuAimModel.mousemoveListener === 0) {
      on(document, 'mousemove', this.__getMouseMoveDocumentHandler());
    }

    menuAimModel.mousemoveListener += 1;
  },

  componentWillUnmount: function() {
    menuAimModel.mousemoveListener -= 1;

    if (menuAimModel.mousemoveListener === 0) {
      off(document, 'mousemove', this.__getMouseMoveDocumentHandler());
      menuAimModel.mouseLocs = [];
    }

    clearTimeout(this.__reactMenuAimTimer);
    this.__reactMenuAimTimer = null;
    this.__mouseMoveDocumentHandler = null;
  },

  /**
   * @param  {function} handler The true event handler for your app
   * @param  {object}   e       React's synthetic event object
   */
  handleMouseLeaveMenu: function(handler, e) {
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

    possiblyActivate.call(this, rowIdentifier, handler, this.__reactMenuAimConfig);
  }
};

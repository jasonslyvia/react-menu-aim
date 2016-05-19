/**
 * react-menu-aim is a React Mixin heavily inspired by jQuery-menu-aim. All rights
 * reserved by the original author.
 *
 * https://github.com/jasonslyvia/react-menu-aim
 * https://github.com/kamens/jQuery-menu-aim
*/

import React from 'react';
// import {on, off, handleMouseMoveDocument, activate, getActivateDelay, mousemoveListener, mouseLocs} from './src/core.js';
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
    handler(rowIdentifier);
  }
}

/**
 * @export
 */
export default function reactMenuAimDecorator(reactMenuAimConfig) {
  return function (ComposedComponent) {
    return class MenuAimDecorator extends React.Component {

      __getMouseMoveDocumentHandler() {
        if (!this.__mouseMoveDocumentHandler) {
          this.__mouseMoveDocumentHandler = handleMouseMoveDocument.bind(this);
        }

        return this.__mouseMoveDocumentHandler;
      }

      componentDidMount() {
        if (menuAimModel.mousemoveListener === 0) {
          on(document, 'mousemove', this.__getMouseMoveDocumentHandler());
        }

        menuAimModel.mousemoveListener += 1;
      }

      componentWillUnmount() {
        menuAimModel.mousemoveListener -= 1;

        if (menuAimModel.mousemoveListener === 0) {
          off(document, 'mousemove', this.__getMouseMoveDocumentHandler());
          menuAimModel.mouseLocs = [];
        }

        clearTimeout(this.__reactMenuAimTimer);
        this.__reactMenuAimTimer = null;
        this.__mouseMoveDocumentHandler = null;
      }

      /**
       * @param  {function} handler The true event handler for your app
       * @param  {object}   e       React's synthetic event object
       */
      handleMouseLeaveMenu(handler, e) {
        if (this.__reactMenuAimTimer) {
          clearTimeout(this.__reactMenuAimTimer);
        }

        if (typeof handler === 'function') {
          handler.call(this, e);
        }
      }

      /**
       * @param  {number}   rowIdentifier  The identifier of current row, ie. index or name
       * @param  {function} handler        The true event handler for your app
       * @param  {object}   e              React's synthetic event object
       */
      handleMouseEnterRow(rowIdentifier, handler) {
        if (this.__reactMenuAimTimer) {
          clearTimeout(this.__reactMenuAimTimer);
        }

        // possiblyActivate.call(this, rowIdentifier, handler, reactMenuAimConfig);
        possiblyActivate.call(this, rowIdentifier, handler, reactMenuAimConfig);
      }

      render() {
        return <ComposedComponent {...this.props}
          handleMouseLeaveMenu={this.handleMouseLeaveMenu.bind(this)}
          handleMouseEnterRow={this.handleMouseEnterRow.bind(this)}
          ></ComposedComponent>;
      }
    }
  }
}

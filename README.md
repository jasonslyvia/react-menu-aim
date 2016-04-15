ReactMenuAim
==============================================

A React Mixin makes your menu works as **magical** as Amazon's implementation, this repo is heavily inspired by [jQuery-menu-aim](https://github.com/kamens/jQuery-menu-aim/).

[中文说明](http://undefinedblog.com/react-menu-aim/)

[![Build Status](https://travis-ci.org/jasonslyvia/react-menu-aim.svg)](https://travis-ci.org/jasonslyvia/react-menu-aim)
[![npm version](https://badge.fury.io/js/react-menu-aim.svg)](http://badge.fury.io/js/react-menu-aim)

![ReactMenuAim demo](https://cloud.githubusercontent.com/assets/1336484/8591773/198d1d4a-265d-11e5-94b1-97071a591ab1.gif)

**If you tend to support React v0.13, please use react-menu-aim@0.1.1 which is the latest compatible version.**

## How to use

[Live Demo](http://jasonslyvia.github.io/react-menu-aim/demo/index.html)

You can also checkout `./demo` folder find out the simple & stragiht demo usage, or here's a quick look.

```javascript
var React = require('react');
var ReactMenuAim = require('react-menu-aim');

var Menu = React.createClass({
  mixins: [ReactMenuAim],

  componentWillMount: function() {
    // Config ReactMenuAim here
    this.initMenuAim({
      submenuDirection: 'right',
      menuSelector: '.menu'
    });
  },

  // This is your true handler when a menu item is going to be active
  handleSwitchMenuIndex: function(index) {
    // ...
  },

  // `this.handleMouseLeaveMenu` and `this.handleMouseEnterRow` are provided by ReactMenuAim,
  // you can provide your own handler bound to them
  render: function() {
    return (
      <div className="menu-container">
        <ul className="menu" onMouseLeave={this.handleMouseLeaveMenu}>
          <li className="menu-item" onMouseEnter={this.handleMouseEnterRow.bind(this, 0, this.handleSwitchMenuIndex)}>Menu Item 1</li>
          <li className="menu-item" onMouseEnter={this.handleMouseEnterRow.bind(this, 1, this.handleSwitchMenuIndex)}>Menu Item 2</li>
        </ul>
      </div>
    );
  }
});
```

## Event handler

The following event handlers are provided by ReactMenuAim.

**DO NOT** call them directly, pass them as event handler in component's `render` method.

### handleMouseLeaveMenu

This event handler should be called when mouse is leaving the menu.

**Arguments**

 1. handler (*Function*) You can provide your own handler when mouse leave menu
 2. e       (*Object*)   React's synthetic event


### handleMouseEnterRow

This event handler should be called when mouse is entering a menu item.

**Arguments**

 1. rowIdentifier (*Any*)   The identifier you provided to identify a row, usually it's row index or something, will be passed to your handler when a menu is going to be activated.
 2. handler (*Function*)    You can provide your own handler when mouse enter a row
 3. e       (*Object*)      React's synthetic event

## Configuration

To configure ReactMenuAim, you should call `this.initMenuAim` in your React component with your options.

```javascript
  componentWillMount: function() {
    this.initMenuAim({
      // options
    });
  }
```

### submenuDirection

Type: string  Default: 'right'

Indicates the direction of submenu.

### menuSelector

Type: string  Default: '*'

Determine the position and offset of menu container. This selector should be constrained on the very exact menu area(which we are switching), not including submenu area.

### delay

Type: number  Default: 300

When user is moving mouse and have a tendency of viewing submenu, how many ms to wait before making next move.

### tolerance

Type: number  Default: 75

The larger, the submenu is more likely to show.


## Scripts

```
$ npm install
$ npm run test
$ npm run build
$ npm run watch
```

## License

MIT



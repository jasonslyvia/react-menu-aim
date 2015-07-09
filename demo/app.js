'use strict';

var React = require('react');
var ReactMenuAim = require('../index');


var menuData = [{
  name: 'File',
  subMenu: ['New File', 'Open', 'Open Recent', 'ReOpen with Encoding', 'New View into File', 'Save', 'Save with Encoding', 'Sava As', 'Save All']
}, {
  name: 'Edit',
  subMenu: ['Undo Insert Characters', 'Repeat Insert Characters', 'Undo Selection', 'Copy', 'Cut', 'Paste', 'Paste and Indent', 'Paste from History']
}, {
  name: 'Selection',
  subMenu: ['Split into Lines', 'Add Previous Line', 'Add Next Line', 'Single Selection', 'Invert Selection']
}, {
  name: 'Find',
  subMenu: ['Find', 'Find Next', 'Find Previous', 'Increment Find']
}, {
  name: 'View',
  subMenu: ['Show minimap', 'Hide Tabs', 'Hide Status Bar', 'Show Console', 'Enter Full Screen', 'Enter Distraction Free Mode', 'Layout', 'Groups']
}, {
  name: 'Goto',
  subMenu: ['Goto Anything', 'Goto Symbol', 'Goto Symbol in Project', 'Goto Definition', 'Goto Line', 'Jump Back', 'Jump Forward']
}, {
  name: 'Tools',
  subMenu: ['Command Palette', 'Snippets', 'Build System', 'Build', 'Build With']
}, {
  name: 'Project',
  subMenu: ['Open Project', 'Switch Project', 'Quick Switch Project', 'Open Recent', 'Save Project As']
}, {
  name: 'Window',
  subMenu: ['Minimize', 'Zoom', 'Bring All to Front']
}];


var Menu = React.createClass({
  mixins: [ReactMenuAim],

  getDefaultProps: function() {
    return {
      submenuDirection: 'right'
    };
  },

  getInitialState: function() {
    return {
      activeMenuIndex: 0
    };
  },

  componentWillMount: function() {
    this.initMenuAim({
      submenuDirection: this.props.submenuDirection,
      menuSelector: '.menu',
      delay: 300,
      tolerance: 75
    });
  },

  handleSwitchMenuIndex: function(index) {
    this.setState({
      activeMenuIndex: index
    });
  },

  render: function() {
    var self = this;
    var containerClassName = 'menu-container ' + this.props.submenuDirection;

    var subMenuStyle = {};
    if (this.props.submenuDirection === 'below') {
      subMenuStyle.left = this.state.activeMenuIndex * 140;
    }

    return (
      <div className={containerClassName}>
        <ul className="menu" onMouseLeave={this.handleMouseLeaveMenu}>
          {this.props.menuData.map(function(menu, index) {
            var className = 'menu-item';
            if (index === self.state.activeMenuIndex) {
              className += ' active';
            }

            return (
              <li className={className} key={index}
                  onMouseEnter={function(){
                    self.handleMouseEnterRow.call(self, index, self.handleSwitchMenuIndex);
                  }}>
                {menu.name}
              </li>
            );
          })}
        </ul>
        <ul className="sub-menu" style={subMenuStyle}>
          {this.props.menuData[this.state.activeMenuIndex].subMenu.map((function(subMenu, index){
            return (
              <li className="sub-menu-item" key={index}>{subMenu}</li>
            );
          }))}
        </ul>
      </div>
    );
  }
});

React.render(<Menu menuData={menuData} />, document.querySelector('#demo1 .demo-container'));
React.render(<Menu menuData={menuData} submenuDirection="below" />, document.querySelector('#demo3 .demo-container'));

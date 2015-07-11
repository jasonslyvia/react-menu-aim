var React = require('react');
var Menu = require('./Menu');
var menuData = require('./menuData');


React.render(<Menu menuData={menuData} />, document.querySelector('#demo1 .demo-container'));
React.render(<Menu menuData={menuData} submenuDirection="below" />, document.querySelector('#demo3 .demo-container'));

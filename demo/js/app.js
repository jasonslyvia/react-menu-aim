var React = require('react');
var ReactDOM = require('react-dom');
var Menu = require('./Menu');
var menuData = require('./menuData');

window.React = React;


ReactDOM.render(<Menu menuData={menuData} />, document.querySelector('#demo1 .demo-container'));
ReactDOM.render(<Menu menuData={menuData} submenuDirection="below" />, document.querySelector('#demo3 .demo-container'));

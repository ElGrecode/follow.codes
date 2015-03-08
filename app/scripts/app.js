/** @jsx React.DOM */
// Entire super set of application for client side rendering

var React = require('react/addons');
var FollowApp = React.createFactory(require('./components/FollowApp').FollowApp);
var mountNode = document.getElementById('app');
var AudioStore = require('../stores/audio');

// Async Components
var AsyncCodePlayground = require('./components/code-playground');

// Client side rendering on top of server rendering
React.render(new FollowApp({AsyncCodePlayground: AsyncCodePlayground}), mountNode);

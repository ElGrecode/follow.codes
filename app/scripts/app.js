/** @jsx React.DOM */

var React = require('react/addons');
var FollowApp = React.createFactory(require('../components/FollowApp').FollowApp);
var mountNode = document.getElementById('app');


React.render(new FollowApp({}), mountNode);

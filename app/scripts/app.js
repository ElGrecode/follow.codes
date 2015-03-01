/** @jsx React.DOM */

var React = window.React = require('react'),
    CodePlayground = require('../components/code-playground'),
    mountNode = document.getElementById("app");

//var Timer = require("./ui/Timer");
// old functionality with tests available


var FollowApp = React.createClass({
  render: function() {
    return (
      <div>
        <CodePlayground  />
      </div>
    );
  }
});

React.render(<FollowApp />, mountNode);

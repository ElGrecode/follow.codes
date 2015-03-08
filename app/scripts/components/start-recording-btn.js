/** @jsx React.DOM */
var React = require('react');
//var FCActions = require('../actions/fc-actions');

var StartRecordingBtn = React.createClass({
    propTypes: {
        onClick: React.PropTypes.func
    },

    handleClick: function(){
        //FCActions.startRecording();
        //FCActions.createVideoFormat();
        console.log('Starting recording')
    },

    render: function(){
        return (
            <input type="button" onClick={this.handleClick} value="Start Recording" />
        )
    }
});

module.exports = StartRecordingBtn;

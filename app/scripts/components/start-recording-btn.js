/** @jsx React.DOM */
var React = require('react');
var FCActions = require('../actions/fc-actions');

var StartRecordingBtn = React.createClass({
    /**
     * Handles click on StartRecordingBtn
     */
    handleClick: function(){
        FCActions.startRecordingVideo();
        FCActions.startRecordingAudio();
    },

    render: function(){
        return (
            <input type="button" onClick={this.handleClick} value="Start Recording" />
        )
    }
});

module.exports = StartRecordingBtn;

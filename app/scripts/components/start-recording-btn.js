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
            <span class="step size-16" onClick={this.handleClick} className="record-btn">
                <i id="icon-line-radio-microphone" className="icon-line-radio-microphone"></i>
            </span>
        )
    }
});

module.exports = StartRecordingBtn;

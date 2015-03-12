/** @jsx React.DOM */
var React = require('react');
var FCActions = require('../actions/fc-actions');

var StopRecordingBtn = React.createClass({
    /**
     * Handles click on StopRecordingBtn
     */
    handleClick: function(){
        FCActions.stopRecordingVideo();
        //FCActions.createVideoFormat();
    },

    render: function(){
        return (
            <input type="button" onClick={this.handleClick} value="Stop Recording" />
        )
    }
});

module.exports = StopRecordingBtn;

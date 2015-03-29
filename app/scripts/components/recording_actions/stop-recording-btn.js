/** @jsx React.DOM */
var React = require('react');
var FCActions = require('../../actions/fc-actions');

var StopRecordingBtn = React.createClass({
    propTypes: {
      isRecording: React.PropTypes.bool
    },

    /**
     * Handles click on StopRecordingBtn
     */
    handleClick: function(){
        FCActions.stopRecordingVideo();
        FCActions.stopRecordingAudio();
        //FCActions.createAudioPlayback();
        //FCActions.createVideoFormat();
    },

    render: function(){
        var display = this.props.isRecording ? {display: 'inline-block'} : {display: 'none'};
        return (
            <span onClick={this.handleClick} className="stop-btn step size-16" style={display}>
                <i id="icon-line-stop" className="icon-line-stop"></i>
            </span>
        )
    }
});

module.exports = StopRecordingBtn;

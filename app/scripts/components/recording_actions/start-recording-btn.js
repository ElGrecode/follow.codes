/** @jsx React.DOM */
var React = require('react');
var FCActions = require('../../actions/fc-actions');

var StartRecordingBtn = React.createClass({
    propTypes: {
        recordingIsAllowable: React.PropTypes.bool,
        isRecording: React.PropTypes.bool,
        audioIsPlaying: React.PropTypes.bool
    },

    /**
     * Handles click on StartRecordingBtn
     */
    startRecording: function(){
        FCActions.startRecordingVideo();
        FCActions.startRecordingAudio();
    },

    render: function(){
        // If recording is allowable for this browser, and we are not currently recording or playing
        var display = this.props.recordingIsAllowable && !this.props.isRecording && !this.props.audioIsPlaying ?
          {display: 'inline-block'} : {display: 'none'};

        return (
            <span onClick={this.startRecording} className="record-btn step size-16" style={display}>
                <i id="icon-line-radio-microphone" className="icon-line-radio-microphone"></i>
            </span>
        )
    }
});

module.exports = StartRecordingBtn;

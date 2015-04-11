/** @jsx React.DOM */
var React = require('react');
var FCActions = require('../../actions/fc-actions');

var PauseRecordingBtn = React.createClass({
    propTypes: {
        audioIsPlaying: React.PropTypes.bool
    },

    /**
     * Handles click and broadcasts pauses audio and video
     */
    handleClick: function(){
        FCActions.pauseAudio();
        FCActions.pauseVideo();
    },

    render: function(){
        // If we audio playing - display the pause button
        var display = this.props.audioIsPlaying ? {display: 'inline-block'} : {display: 'none'};

        return (
            <span onClick={this.handleClick} className="pause-btn step size-16" style={display}>
                <i id="icon-line-pause" className="icon-line-pause"></i>
            </span>
        )
    }
});

module.exports = PauseRecordingBtn;

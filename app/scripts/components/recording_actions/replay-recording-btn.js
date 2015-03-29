/** @jsx React.DOM */
var React = require('react');
var FCActions = require('../../actions/fc-actions');

var ReplayBtn = React.createClass({
    propTypes: {
        videoIsReady: React.PropTypes.bool,
        audioIsReady: React.PropTypes.bool
    },

    /**
     * Handles click on Replay Recording Btn
     */
    handleClick: function(){
        FCActions.playbackAudio();
        FCActions.playbackVideo();
    },

    render: function(){
        // If we have a video and audio ready, display the playback button
        var display = this.props.videoIsReady && this.props.audioIsReady ? {display: 'inline-block'} : {display: 'none'};
        return (
            <span onClick={this.handleClick} className="play-btn step size-16" style={display}>
                <i id="icon-line-play" className="icon-line-play"></i>
            </span>
        )
    }
});

module.exports = ReplayBtn;

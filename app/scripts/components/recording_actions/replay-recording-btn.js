/** @jsx React.DOM */
var React = require('react');
var FCActions = require('../../actions/fc-actions');

// Stores
var AudioStore = require('../../stores/audio');
var VideoStore = require('../../stores/video');

// Access state methods
function _getAudio(){
    return AudioStore.getAudio();
}
function _getVideo(){
    return VideoStore.getVideo();
}

var ReplayBtn = React.createClass({
    //todo: Consider making this a mixin
    getInitialState:function(){
        return {
            audio:_getAudio(),
            video: _getVideo()
        };
    },

    /**
     * Add store change listeners
     */
    componentWillMount: function(){
        AudioStore.addChangeListener(this._audioChange);
        VideoStore.addChangeListener(this._videoChange);
    },

    _audioChange: function(){
        this.setState({audio: _getAudio()});
    },

    _videoChange: function(){
        this.setState({video: _getVideo()})
    },

    /**
     * Handles click on Replay Recording Btn
     */
    handleClick: function(){
        FCActions.playbackAudio();
        FCActions.playbackVideo();
    },

    render: function(){
        // If we have a video, display the playback button
        var display = this.state.video ? {display: 'inline-block'} : {display: 'none'};
        return (
            <span onClick={this.handleClick} className="play-btn step size-16" style={display}>
                <i id="icon-line-play" className="icon-line-play"></i>
            </span>
        )
    }
});

module.exports = ReplayBtn;

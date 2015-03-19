/** @jsx React.DOM */
var React = require('react');

// Stores
var RecorderStore = require('../../stores/recorder');

// Access state methods
function _getRecorder(){
    return { recorder: RecorderStore.getRecorder() };
}

var ReplayBtn = React.createClass({
    //todo: Consider making this a mixin
    getInitialState:function(){
        return _getRecorder();
    },

    componentWillMount: function() {
        RecorderStore.addChangeListener(this._onChange);
    },

    _onChange: function() {
        this.setState(_getRecorder());
    },

    /**
     * Handles click on Replay Recording Btn
     */
    handleClick: function(){
        // playback
    },

    render: function(){
        var display = this.state.recorder.isRecording ? {display: 'none'} : {display: 'inline-block'};
        return (
            <span onClick={this.handleClick} className="play-btn step size-16" style={display}>
                <i id="icon-line-play" className="icon-line-play"></i>
            </span>
        )
    }
});

module.exports = ReplayBtn;

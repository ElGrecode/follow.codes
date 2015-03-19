/** @jsx React.DOM */
var React = require('react');
var FCActions = require('../../actions/fc-actions');

// Stores
var RecorderStore = require('../../stores/recorder');

// Access state methods
function _getRecorder(){
    return { recorder: RecorderStore.getRecorder() };
}


var StartRecordingBtn = React.createClass({
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
     * Handles click on StartRecordingBtn
     */
    handleClick: function(){
        FCActions.startRecordingVideo();
        FCActions.startRecordingAudio();
    },

    render: function(){
        var display = this.state.recorder.isRecording || !this.state.recorder.isAllowable ? {display: 'none'} : {display: 'inline-block'};
        return (
            <span onClick={this.handleClick} className="record-btn step size-16" style={display}>
                <i id="icon-line-radio-microphone" className="icon-line-radio-microphone"></i>
            </span>
        )
    }
});

module.exports = StartRecordingBtn;

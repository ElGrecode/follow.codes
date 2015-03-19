/** @jsx React.DOM */
var React = require('react');
var FCActions = require('../../actions/fc-actions');

// Stores
var RecorderStore = require('../../stores/recorder');

// Access state methods
function _getRecorder(){
    return { recorder: RecorderStore.getRecorder() };
}

var StopRecordingBtn = React.createClass({
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
     * Handles click on StopRecordingBtn
     */
    handleClick: function(){
        FCActions.stopRecordingVideo();
        FCActions.stopRecordingAudio();
        //FCActions.createVideoFormat();
    },

    render: function(){
        var display = this.state.recorder.isRecording   ? {display: 'inline-block'} : {display: 'none'};
        return (
            <span onClick={this.handleClick} className="stop-btn step size-16" style={display}>
                <i id="icon-line-stop" className="icon-line-stop"></i>
            </span>
        )
    }
});

module.exports = StopRecordingBtn;

/** @jsx React.DOM */
var React = require('react');

// Stores
var RecorderStore = require('../../stores/recorder');

// Access state methods
function _getRecorder(){
    return { recorder: RecorderStore.getRecorder() };
}


var RecordingState = React.createClass({
    getInitialState:function(){
        return _getRecorder();
    },

    componentWillMount: function() {
        RecorderStore.addChangeListener(this._onChange);
    },

    _onChange: function() {
        this.setState(_getRecorder());
    },

    render: function(){
        var recording = this.state.recorder.isRecording ? 'recording' : '';
        return (
            <div className={recording}>
                <i className="icon-circle"></i>
            </div>
        )
    }
});

module.exports = RecordingState;

/** @jsx React.DOM */
var React = require('react');

// Stores
var RecorderStore = require('../../stores/recorder');


// Components
var RecordingState = require('./recording-state.js');
var ReplayRecordingBtn = require('./replay-recording-btn.js');
var StopRecordingBtn = require('./stop-recording-btn');
var StartRecordingBtn = require('./start-recording-btn');
var Visualizer = require('./visualizer');

// Access state methods
function _getRecorder(){
    return { recorder: RecorderStore.getRecorder() };
}

var RecordingActions = React.createClass({
    getInitialState: function(){
        return {
            recorder: _getRecorder().recorder
        }
    },

    componentWillMount: function() {
        RecorderStore.addChangeListener(this._onChange);
    },

    _onChange: function() {
        var that = this;
        this.setState(_getRecorder());
    },

    render: function(){
        return (
            <div className='recording-actions' data-phase={this.state.recorder.phase}>
                <div className="action-wrapper">
                    <RecordingState />
                    <ReplayRecordingBtn />
                    <StartRecordingBtn />
                    <StopRecordingBtn />
                    <Visualizer />
                </div>
            </div>
        )
    }
});

module.exports = RecordingActions;

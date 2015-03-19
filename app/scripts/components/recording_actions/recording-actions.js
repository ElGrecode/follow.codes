/** @jsx React.DOM */
var React = require('react');

// Components
var RecordingState = require('./recording-state.js');
var ReplayRecordingBtn = require('./replay-recording-btn.js');
var StopRecordingBtn = require('./stop-recording-btn');
var StartRecordingBtn = require('./start-recording-btn');

var RecordingActions = React.createClass({

    render: function(){
        return (
            <div className="recording-actions">
                <div className="action-wrapper">
                    <RecordingState />
                    <ReplayRecordingBtn />
                    <StartRecordingBtn />
                    <StopRecordingBtn />
                </div>
            </div>
        )
    }
});

module.exports = RecordingActions;

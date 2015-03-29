/** @jsx React.DOM */
var React = require('react');

// Stores
var RecorderStore = require('../../stores/recorder');
var AudioStore = require('../../stores/audio');
var VideoStore = require('../../stores/video');

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
function _getAudio(){
    return { audio: AudioStore.getAudio() };
}
function _getVideo(){
    return { video: VideoStore.getVideo() };
}

var RecordingActions = React.createClass({
    getInitialState: function(){
        return {
            recorder: _getRecorder().recorder,
            video: _getVideo().video,
            audio: _getAudio().audio
        }
    },


    /**
     * Register specific changes in state
     */
    componentWillMount: function() {
        RecorderStore.addChangeListener(this._recorderChange);
        AudioStore.addChangeListener(this._audioChange);
        VideoStore.addChangeListener(this._videoChange);
    },

    /*** State setters ***/
    _recorderChange: function() {
        this.setState(_getRecorder());
    },
    _audioChange: function(){
        this.setState(_getAudio());
    },
    _videoChange: function(){
        this.setState(_getVideo())
    },

    render: function(){
        return (
            <div className='recording-actions' data-phase={this.state.recorder.phase}>
                <div className="action-wrapper">
                    <RecordingState isRecording={this.state.recorder.isRecording}/>
                    <ReplayRecordingBtn videoIsReady={this.state.video.isReady} audioIsReady={this.state.audio.isReady}/>
                    <StartRecordingBtn recordingIsAllowable={this.state.recorder.isAllowable} isRecording={this.state.recorder.isRecording}/>
                    <StopRecordingBtn isRecording={this.state.recorder.isRecording}/>
                    <Visualizer audio={this.state.audio} phase={this.state.recorder.phase}/>
                </div>
            </div>
        )
    }
});

module.exports = RecordingActions;

/** @jsx React.DOM */

// App components safe on server side

var React = require('react/addons');
var AudioStore = require('../stores/audio');
var RecorderStore = require('../stores/recorder');
var VideoStore = require('../stores/video');

// Components
var RecordingActions = require('./recording_actions/recording-actions');

function Video( startTime ){
    //this.startState = startState;
    this.startTime = startTime;
    this.events = {};

    return this;
}

// Local cached values for comparison
var isPlaying = false;

var FollowApp = React.createClass({
    // Store getters
    _getAudio: function(){
        return AudioStore.getAudio();
    },
    _getVideo: function(){
        return VideoStore.getVideo();
    },

    getInitialState: function(){
        return {
            video: VideoStore.getVideo(),
            audio: {},
            videoEvents: {},
            eventQueue: {},
            editor: {},
            recording: false
        };
    },
    registerEditor: function( editor ){
        this.state.editor = editor;
    },

    componentWillMount: function() {
        AudioStore.addChangeListener(this._audioChange);
        VideoStore.addChangeListener(this._videoChange);
    },

    shouldComponentUpdate: function(nextProps, nextState){
        // Unfortunately for our top level component, every rerender causes our 3rd party code editor
        // to lose it state. It's state is not complete under our control.
        // This necessitates only re-rendering when we want to replay our video.

        // Check previous isPlaying value and compare it to nextState
        if (nextState.audio.isPlaying === true && isPlaying === false){
            //// start playing back of audio
            //var audioTag =  this.refs.audioPlayer.getDOMNode();
            //console.log('audioTag->', audioTag);

        }
        if (nextState.video.isPlaying === true && isPlaying === false) {
            // start playing back of audio and reflect isPlaying change
            isPlaying = true;
            this._replayVideo();
            return true;
        }
        return false;
        //console.log('recognizing a change in the top level element');
        //// check cached value to see if there was a change
        //console.log('isPlaying->', isPlaying);
        //console.log('current Video state->', this.state.video);
        //if (isPlaying === false && this.state.video === true){
        //    console.log('Going for the replay');
        //    isPlaying = true;
        //    _replayVideo();
        //}

    },

    componentDidUpdate: function(prevProps, prevState){
        // start playing back of audio
        var audioTag =  this.refs.audioPlayer.getDOMNode();
        // looks like a lag of 700 or so ms between audio and video playback
        // todo: figure out why
        setTimeout(function(){
            audioTag.play();
        }, 1000)
    },
    //_onChange: function() {
    //    console.log('setting audio state');
    //    this.setState({audio: this._getAudio()});
    //},

    _audioChange: function(){
        this.setState({audio: this._getAudio()})
    },

    _videoChange: function(){
        this.setState({video: this._getVideo()})
    },

    /**
     * Calculates the replaying of our videoEvent log
     * @private
     */
    _replayVideo: function(){
        var videoEvents = this.state.video.playableVideo;
        var TICKINCREMENT = 1000;
        var document = this.state.editor.getSession().getDocument();
        console.log('document', document);
        console.log('videoEvents', videoEvents);

        var tick = 0;
        var playbackId = setInterval(function(){ // Every tick interval, set up queue events to fire

            console.log('tick: ' + tick);
            var eventsForTickArr = videoEvents[tick];
            if (eventsForTickArr){ // If we have events for this tick
                var mskeys = Object.keys(eventsForTickArr);
                console.log(mskeys);

                mskeys.forEach(function(eventTime, index){
                    setTimeout(function(){
                        document.applyDeltas([ eventsForTickArr[eventTime] ]);
                    }, eventTime);
                });
            }

            tick++;
        }, TICKINCREMENT);

        setTimeout(function(){
            // clear playback after finished
            console.log('Video Done');
            clearInterval(playbackId);
        }, this.state.video.lastEventTime + 1000);
    },

    /**
     * Renders our Follow Codes application
     * @returns {XML}
     */
    render: function() {
        // async loading of codePlayground
        // todo: Come up with a better solution to do this
        var AsyncCodePlayground = this.props.AsyncCodePlayground ?
            React.createFactory(this.props.AsyncCodePlayground) :
            function(){ return React.createElement('div', {id: 'brace-editor', style: {height: '100%'}}) }; // Async fake container div with id

        return (
            <div>
                {AsyncCodePlayground({updateEditor: this.updateEditor, registerEditorState: this.registerEditor})}
                <RecordingActions />
                <audio id="soundy" ref="audioPlayer" src={this.state.audio.audioFile} controls>
                    Your browser does not support the <code>audio</code> element.
                </audio>
            </div>
        );
    }
});
/* Module.exports instead of normal dom mounting */
module.exports.FollowApp = FollowApp;

// <EndRecording />

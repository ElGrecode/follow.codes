/** @jsx React.DOM */

// App components safe on server side

var React = require('react/addons');
var StopRecordingBtn = require('./stop-recording-btn');
var StartRecordingBtn = require('./start-recording-btn');
var AudioStore = require('../stores/audio');
var RecorderStore = require('../stores/recorder');
var VideoStore = require('../stores/video');

function Video( startTime ){
    //this.startState = startState;
    this.startTime = startTime;
    this.events = {};

    return this;
}

var FollowApp = React.createClass({
    getInitialState: function(){
        return {
            video: {},
            videoEvents: {},
            eventQueue: {},
            editor: {},
            recording: false,
        };
    },
    registerEditor: function( editor ){
        this.state.editor = editor;
    },
    // todo: determine where replay video goes (does it live on element?)
    replayVideo: function(){
        console.log('playing')
        var videoEvents = this.state.videoEvents;
        var TICKINCREMENT = 1000;
        var document = this.state.editor.getSession().getDocument();

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
    render: function() {
        // async loading of codePlayground
        // todo: Come up with a better solution to do this
        var AsyncCodePlayground = this.props.AsyncCodePlayground ?
            React.createFactory(this.props.AsyncCodePlayground) :
            function(){ return React.createElement('div', {id: 'brace-editor', style: {height: '100%'}}) }; // Async fake container div with id

        return (
            <div>
                {AsyncCodePlayground({updateEditor: this.updateEditor, registerEditorState: this.registerEditor})}
                <input type="button" onClick={this.replayVideo} value="replay" />
                <StartRecordingBtn />
                <StopRecordingBtn />

            </div>
        );
    }
});
/* Module.exports instead of normal dom mounting */
module.exports.FollowApp = FollowApp;

// <EndRecording />

/** @jsx React.DOM */

var React = require('react/addons');
var EndRecording = require('./end-recording');

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

    //*** Video Functions ***//
    _processEvents: function(){
        var self = this;
        // *Takes events in eventQueue and creates a playable video
        var TICKINCREMENT = 1000;
        var totalTicks = Math.ceil(this.state.video.lastEventTime / TICKINCREMENT);
        var eventQueue = this.state.eventQueue;

        // for each tick, determine how many events occurred
        for (var tick = 0; tick < totalTicks; tick++){
            var startOfTick = tick * TICKINCREMENT;
            var endOfTick = startOfTick + TICKINCREMENT;

            // Iterate over events
            var mskeys = Object.keys(eventQueue);
            mskeys.forEach(function(eventTime){
                // loop over ms eventTimes checking for matches within tick range
                if (eventTime >= startOfTick && eventTime < endOfTick){
                    // {0: [{relativeTime: evt}, {relativeTime: evt}] }
                    // {1: [{relativeTime: evt}] }
                    // evenTime should be in ms relativeTime to tick

                    var relativeTime = eventTime - startOfTick;

                    if (tick in self.state.videoEvents){ // push event if tick is already present
                        // place event within tick with new relative time
                        self.state.videoEvents[tick][relativeTime] = self.state.eventQueue[eventTime];
                    } else { // create tick with first event
                        // create object first
                        self.state.videoEvents[tick] = {};
                        self.state.videoEvents[tick][relativeTime] = self.state.eventQueue[eventTime];
                    }
                }
            })
        }

        console.log('this.state.videoEvents');
        console.log(this.state.videoEvents);

        console.log('this.state.eventQueue');
        console.log(this.state.eventQueue);

    },

    //*** App Functions ***//
    updateEditor: function( evt ){
        // Don't rerender the application, silently update state
        if (this.state.recording){
            // Calculate event time slot
            var eventTime = Date.now(),
                eventIndex = Math.floor((eventTime - this.state.video.startTime));

            this.state.eventQueue[eventIndex] = evt.data;
            this.state.video.lastEventTime = eventIndex;
        }
    },
    startRecording: function(){
        if (!this.state.recording){
            this.setState({ recording: true});
            this.setState({ video: new Video(Date.now()) });
            console.log(this.state.video);
        }
    },
    endRecording: function(){
        if (this.state.recording){
            this.setState({ recording: false});
            this._processEvents();
        }
    },
    registerEditor: function( editor ){
        this.state.editor = editor;
    },
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
            function(){ return React.createElement('div', {id: 'brace-editor'}) }; // Async fake container div with id

        return (
            <div>
                {AsyncCodePlayground({updateEditor: this.updateEditor, registerEditorState: this.registerEditor})}
                <input type="button" onClick={this.replayVideo} value="replay" />
                <input type="button" onClick={this.startRecording} value="Start Recording" />
                <EndRecording />
            </div>
        );
    }
});
/* Module.exports instead of normal dom mounting */
module.exports.FollowApp = FollowApp;

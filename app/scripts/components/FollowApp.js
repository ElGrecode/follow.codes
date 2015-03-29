/** @jsx React.DOM */

// App components safe on server side

var React = require('react/addons');
var AudioStore = require('../stores/audio');
var RecorderStore = require('../stores/recorder');
var VideoStore = require('../stores/video');

// Top Level Components
var RecordingActions = require('./recording_actions/recording-actions');
var Player = require('./player/player');

function Video( startTime ){
    //this.startState = startState;
    this.startTime = startTime;
    this.events = {};

    return this;
}

var FollowApp = React.createClass({
    getInitialState: function(){
        return {
            audio: {},
            videoEvents: {},
            eventQueue: {},
            editor: {},
            recording: false
        };
    },
    /**
     * Register the editor locally so children can reference it
     * @param editor
     */
    registerEditor: function( editor ){
        this.setState({editor: editor});
    },

    //shouldComponentUpdate: function(nextProps, nextState){
    //    // Unfortunately for our top level component, every rerender causes our 3rd party code editor
    //    // to lose it state. It's state is not complete under our control.
    //    // This necessitates only re-rendering when we want to replay our video.
    //
    //    // Check previous isPlaying value and compare it to nextState
    //    if (nextState.audio.isPlaying === true && isPlaying === false){
    //        //// start playing back of audio
    //        //var audioTag =  this.refs.audioPlayer.getDOMNode();
    //        //console.log('audioTag->', audioTag);
    //
    //    }
    //    if (nextState.video.isPlaying === true && isPlaying === false) {
    //        // start playing back of audio and reflect isPlaying change
    //        isPlaying = true;
    //        return true;
    //    }
    //    return false;
    //    // todo: *cleanup*
    //    //console.log('recognizing a change in the top level element');
    //    //// check cached value to see if there was a change
    //    //console.log('isPlaying->', isPlaying);
    //    //console.log('current Video state->', this.state.video);
    //    //if (isPlaying === false && this.state.video === true){
    //    //    console.log('Going for the replay');
    //    //    isPlaying = true;
    //    //    _replayVideo();
    //    //}
    //
    //},

    //_onChange: function() {
    //    console.log('setting audio state');
    //    this.setState({audio: this._getAudio()});
    //},



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
                <Player editor={this.state.editor}/>
            </div>
        );
    }
});
/* Module.exports instead of normal dom mounting */
module.exports.FollowApp = FollowApp;

// <EndRecording />
//<audio id="soundy" ref="audioPlayer" src={this.state.audio.audioFile} controls>
//    Your browser does not support the <code>audio</code> element.
//</audio>

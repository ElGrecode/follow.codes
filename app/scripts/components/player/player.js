/** @jsx React.DOM */
var React = require('react');

// Stores
var PlayerStore = require('../../stores/player');
var AudioStore = require('../../stores/audio');
var VideoStore = require('../../stores/video');
var FCActions = require('../../actions/fc-actions');

// Components
// ... add components here

// Store's getter methods
function _getPlayer(){
    return { player: PlayerStore.getPlayer() };
}
function _getAudio(){
    return { audio: AudioStore.getAudio() };
}
function _getVideo(){
    return { video: VideoStore.getVideo() };
}

// Local cached variables
var audioIsPlaying = false;
var videoIsPlaying = false;

var Player = React.createClass({
    getInitialState: function(){
        //return {player: {}, audio: {}};
        return {
            player: _getPlayer(),
            audio: _getAudio(),
            video: _getVideo()
        }
    },

    /**
     * [Lifecycle method] invoked once immediately before the initial rendering occurs
     * Set up listeners for specific store state changes
     */
    componentWillMount: function() {
        PlayerStore.addChangeListener(this._playerChange);
        AudioStore.addChangeListener(this._audioChange);
        VideoStore.addChangeListener(this._videoChange);
    },

    /**
     * [Lifecycle method] invoked once immediately after the initial rendering occurs
     * Set up listeners for DOM events
     */
    componentDidMount: function(){
        var audioTag = this.refs.audioPlayer.getDOMNode();
        audioTag.addEventListener("timeupdate", this._changePlayTime, false);
    },

    /**
     * [Lifecycle method] invoked once immediately before the initial rendering occurs
     * Return value determines whether component should render
     */
    shouldComponentUpdate: function(){
        var audioTag = this.refs.audioPlayer.getDOMNode();
        // Only update in these cases
        // 1. Video recording and Audio recording are ready and a play event has been fired (compare old isPlaying to new isPlaying coming through pipeline)
        // 2. A change in audioIsPlaying has occurred
        // 3. A change in videoIsPlaying has occurred

        // Case 1
        if (this.state.video.isReady && this.state.audio.isReady &&
        audioIsPlaying === false && this.state.audio.isPlaying){
            audioIsPlaying = true;
            this._createAndStartPlayer();
            return true;
        }

        // Case 2a Audio - old state(isPlaying) / new state(isNotPlaying)
        if (audioIsPlaying === true && this.state.audio.isPlaying === false){
            console.log('pausing audio - SWITCHING STATE');
            audioTag.pause();
            audioIsPlaying = false;
            return true;
        // Case 2b Audio - oldState(isNotPlaying) / newState(isNotPlaying)
        } else if (audioIsPlaying === false && this.state.audio.isPlaying === true){
            audioTag.play();
            audioIsPlaying = true;
            return true;
        }

        // Case 3a Video - old state(isPlaying) / new state(isNotPlaying)
        if (videoIsPlaying === true && this.state.video.isPlaying === false){
            console.log('pausing video - SWITCHING STATE');
            this._clearPlaybackInterval(this.state.video.playbackIntervalId);
            videoIsPlaying = false;
            return true;
        // Case 3b Video - oldState(isNotPlaying) / newState(isNotPlaying)
        } else if (videoIsPlaying === false && this.state.video.isPlaying === true){
            // todo: figure out a way to restart the video
            videoIsPlaying = true;
            return true;
        }

        return false;
    },

    /**
     * [Lifecycle method] invoked once immediately after re-rendering occurs
     * Starts audio and video playback
     */
    componentDidUpdate: function(){

    },

    //*** Private methods ***//
    /**
     * Sets local player state
     * @private
     */
    _playerChange: function() {
        this.setState(_getPlayer());
    },
    //
    /**
    * Sets local audio state
    * @private
    */
    _audioChange: function(){
        this.setState( _getAudio());
    },
    /**
     * Sets local video state
     * @private
     */
    _videoChange: function(){
        this.setState( _getVideo());
    },
    /**
     * Changes the time state of audio playback
     * @param evt - playback audio event on time update
     * @private
     */
    _changePlayTime: function(evt){
        console.log('audio player component', evt.target);
        console.log('audio total duration', evt.target.duration);
    },


    /**
     * Creates and starts the screencast A/V player
     * @private
     */
    _createAndStartPlayer: function(){
        // Clear editor or todo: potentially later fill with initial value
        // Initialize
        this.props.editor.setValue("");
        var audioTag =  this.refs.audioPlayer.getDOMNode();

        // Set up event listener on audio, it will keep track of time
        audioTag.addEventListener("timeupdate", this._timeUpdate, false);

        this._replayVideo();
        // todo: figure out why there is a lag of a second
        setTimeout(function(){
            console.log('updating component and playing audio');
            audioTag.play();
        }, 1000)
    },

    /**
     *
     * @private
     */
    _timeUpdate: function( evt ){
        this.setState({playbackTime: evt.target.currentTime})
    },

    /**
     * Calculates the replaying of our videoEvent log
     * @private
     */
        // todo: needs video
        // todo: needs editor to play events
    _replayVideo: function(){
        console.log('editor hopefully????', this.props.editor);

        var videoEvents = this.state.video.playableVideo;
        var TICKINCREMENT = 1000;
        var document = this.props.editor.getSession().getDocument();
        console.log('document', document);
        console.log('videoEvents', videoEvents);

        var tick = 0;
        var playbackIntervalId = setInterval(function(){ // Every tick interval, set up queue events to fire

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
        // Register the playbackIntervalId globally
        FCActions.registerPlaybackIntervalId(playbackIntervalId);

        setTimeout(function(){
            // clear playbackInterval after finished
            console.log('Video Done');
            FCActions.pauseVideo();
        }, this.state.video.lastEventTime + 1000);
    },

    _clearPlaybackInterval: function( intervalId ){
        clearInterval(intervalId);
    },

    render: function(){
        // todo: make sure that we are getting access to the audio file
        //console.log('rerendering -> here is the audiFile->', this.props.audioFile);
        return (
            <div className='player'>
                <audio id="soundy" ref="audioPlayer" src={this.state.audio.audioFile} controls>
                    Your browser does not support the <code>audio</code> element.
                </audio>
            </div>
        )
    }
});

module.exports = Player;

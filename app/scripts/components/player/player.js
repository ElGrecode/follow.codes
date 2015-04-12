/** @jsx React.DOM */
var React = require('react');

//**********
//** Player Component is semi-tangible component handler of synchronization between audio and video playback
//**********

// Stores
var PlayerStore = require('../../stores/player');
var AudioStore = require('../../stores/audio');
var VideoStore = require('../../stores/video');
var FCActions = require('../../actions/fc-actions');

// Components
var _ = require('lodash');

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

// Local cached variables for comparison
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
     * NOTE: Where the action happens on pause/play state change
     * Return value determines whether component should render
     */
    shouldComponentUpdate: function(){
        var audioTag = this.refs.audioPlayer.getDOMNode();
        // Only update in these cases
        // 1. Video recording and Audio recording are ready and a play event has been fired (compare old isPlaying to new isPlaying coming through pipeline)
        // 2. A change in audioIsPlaying has occurred
        // 3. A change in videoIsPlaying has occurred

        // Case 1.)
        if (this.state.video.isReady && this.state.audio.isReady &&
        audioIsPlaying === false && this.state.audio.isPlaying){
            audioIsPlaying = true;
            this._createAndStartPlayer();
            return true;
        }

        //TODO: @elGrecode combine check for audio and video. Two is (maybe) negligible and redundant
        // Case 2a.) Audio Pause - old state(isPlaying) / new state(isNotPlaying)
        if (audioIsPlaying === true && this.state.audio.isPlaying === false){
            console.log('pausing audio - SWITCHING STATE');
            audioTag.pause();
            audioIsPlaying = false;
            return true;
        // Case 2b.) Audio Play - oldState(isNotPlaying) / newState(isNotPlaying)
        } else if (audioIsPlaying === false && this.state.audio.isPlaying === true){
            audioTag.play();
            audioIsPlaying = true;
            return true;
        }

        // Case 3a.) Video Pause - old state(isPlaying) / new state(isNotPlaying)
        if (videoIsPlaying === true && this.state.video.isPlaying === false){
            console.log('DEBUG**: Going to loop over these interval Ids', this.state.video.playbackIntervalIds);
            this._clearPlaybackIntervals(this.state.video.playbackIntervalIds);
            // TODO: Freeze editor,
            // TODO: Also, should these state calculations be handled within the store? (food for thought)
            this._capturePausedVideoPlaybackTime(Date.now() - this.state.video.playbackStartTime);
            this._capturePausedVideoState(this.props.editor.getValue());
            console.log('this is what I think the value is on screen', this.props.editor.getValue());
            videoIsPlaying = false;
            return true;
        // Case 3b.) Video Play - oldState(isNotPlaying) / newState(isNotPlaying)
        } else if (videoIsPlaying === false && this.state.video.isPlaying === true){
            this._startPlayingVideo();
            videoIsPlaying = true;
            return true;
        }

        return false;
    },

    /**
     * [Lifecycle method] invoked once immediately after re-rendering occurs
     * Starts audio and video playback
     */
    //componentDidUpdate: function(){
    //
    //},

    //*** Private methods ***//
    /**
     * Sets local player state
     * @private
     */
    _playerChange: function() {
        this.setState(_getPlayer());
    },

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
        //console.log('audio player component', evt.target);
        //console.log('audio total duration', evt.target.duration);
    },

    /**
     * Creates and starts the screencast A/V player
     * @private
     */
    _createAndStartPlayer: function(){
        // Initialize
        this.props.editor.setValue("");
        var audioTag =  this.refs.audioPlayer.getDOMNode();

        // Set up event listener on audio, it will keep track of time
        audioTag.addEventListener("timeupdate", this._timeUpdate, false);

        setTimeout(function(){
            console.log('updating component and playing audio');
            audioTag.play();
        }, 1000); // Need a second to account for setInterval of videoPlayer
    },

    /**
     * Callback updating the time of the audio
     * TODO: maybe send this up to the audio object store
     * @private
     */
    _timeUpdate: function( evt ){
        this.setState({playbackTime: evt.target.currentTime})
    },

    /**
     * Calculates the replaying of our videoEvent log
     * @private
     */
    _startPlayingVideo: function(){
        this._playVideoFromTime(this.state.video.pausedVideoStateText, this.state.video.pausedVideoTime,
            this.state.video.playableVideo, this.props.editor);
        //setTimeout(function(){
        //    // clear playbackInterval after finished
        //    FCActions.pauseVideo();
        //}, this.state.video.lastEventTime + 1000);
    },

    /**
     * Plays a video from a given point in time
     * @param startingText
     * @param startingTime
     * @param videoEvents
     * @param editor
     * @private
     */
    _playVideoFromTime: function( startingText, startingTime, videoEvents, editor){
        var that = this;
        var TICKINCREMENT = 1000;
        var editorDocument = editor.getSession().getDocument();
        var tick = this.state.video.currentTick;
        var firstTick = tick;
        var tickPartial = startingTime % 1000;
        console.log('***DEBUG: startingTime', startingTime);
        console.log('editorDocument', editorDocument);
        console.log('videoEvents', videoEvents);

        editor.setValue(startingText);
        var startTime = Date.now();
        var playbackIntervalId = setInterval(function(){ // Every tick interval, set up queue events to fire
            FCActions.setCurrentTick(tick);

            console.log('tick: ' + tick);
            var eventsForTickArr = videoEvents[tick];
            if (eventsForTickArr){ // If we have events for this tick
                var mskeys = Object.keys(eventsForTickArr);

                mskeys.forEach(function(eventTime, index){
                    if (firstTick === tick){ // special first tick case
                        if (eventTime > tickPartial) {
                            console.log('FIRST TICK!');
                            setTimeout(function () {
                                if (that.state.video.isPlaying) {
                                    editorDocument.applyDeltas([eventsForTickArr[eventTime]]);
                                } else {
                                    console.log('DEBUG no longer playing so not lingering with', eventsForTickArr[eventTime])
                                }
                            }, eventTime);
                        }
                    } else {
                        setTimeout(function(){
                            if (that.state.video.isPlaying){
                                editorDocument.applyDeltas([ eventsForTickArr[eventTime] ]);
                            } else {
                                console.log('DEBUG no longer playing so not lingering with', eventsForTickArr[eventTime])
                            }
                        }, eventTime);
                    }

                });
            }

            tick++;
        }, TICKINCREMENT);
        // Don't play forever
        var playbackEndId = setTimeout(function(){
            FCActions.pauseVideo(); // clear playbackInterval after finished
        }, this.state.video.lastEventTime + 1000);

        // Register the playbackStartTime and playbackIntervalId globally
		// TODO: rename to reflect the fact that we really own need the in between tick time not the entire time.
        FCActions.registerPlaybackStartTime(startTime);
        FCActions.registerPlaybackIntervalIds([playbackIntervalId, playbackEndId]);
    },

    /**
     * Clears a given event loop interval
     * @param intervalId
     * @private
     * TODO: @elGrecode pausing and interval clearing is imperfect currently- we prevent next tick from occurring, but not the rest of the current useNextTick
     * TODO: The result ends up being a few more additional characters are typed after the video is "truly" paused
     * TODO: We almost want to freeze the editor
     */
    _clearPlaybackIntervals: function( intervalIds ){
        _.each(intervalIds, function(id){
            console.log('clearing these intervals', intervalIds);
            clearInterval(id);
        });
    },

    /**
     * Captures the current text of the paused video
     * @param videoText
     * @private
     */
    _capturePausedVideoState: function( videoText ){
        FCActions.capturePausedVideoState(videoText);
    },

    /**
     * Captures the current time of the paused video
     * @param currentVideoTime
     * @private
     */
    _capturePausedVideoPlaybackTime: function( currentVideoTime ){
        FCActions.capturePausedVideoTime(currentVideoTime);
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

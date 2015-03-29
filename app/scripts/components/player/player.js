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
var isPlaying = false;

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
        // Only update in these cases
        // 1. Video recording and Audio recording are ready and a play event has been fired (compare old isPlaying to new isPlaying coming through pipeline)
        // 2. A change in player has occurred

        // Case 1
        if (this.state.video.isReady && this.state.audio.isReady &&
        isPlaying === false && this.state.audio.isPlaying){
            isPlaying = true;
            return true;
        }

        // Case 2
        if (false){
            return true;
        }

        return false;
    },

    /**
     * [Lifecycle method] invoked once immediately after re-rendering occurs
     * Starts audio and video playback
     */
    componentDidUpdate: function(){
        // Clear editor or todo: potentially later fill with initial value
        this.props.editor.setValue("");
        this._replayVideo();

        // start playing back of audio
        var audioTag =  this.refs.audioPlayer.getDOMNode();
        // todo: figure out why there is a lag of a second
        setTimeout(function(){
            console.log('updating component and playing audio');
            audioTag.play();
        }, 1000)
    },

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

    //*** Private methods ***//
    /**
     * Changes the time state of audio playback
     * @param evt - playback audio event on time update
     * @private
     */
    _changePlayTime: function(evt){
        console.log('changing play time');
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

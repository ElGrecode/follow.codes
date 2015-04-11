/**
 * Video Store manages our video data
 */

// --- Dependencies --- //
var _ = require('lodash');
var EventEmitter = require('events').EventEmitter;
var FCConstants = require('../constants/fc-constants');
var FCDispatcher = require('../dispatcher/fc-dispatcher');


function Video( startTime ){
    //this.startState = startState;
    this.startTime = startTime;
    this.isRecording = false;
    this.isPlaying = false;
    this.recordedEvents = {};
    this.playbackIntervalId = undefined;
    this.playbackStartTime = undefined;
    this.pausedVideoStateText = undefined;
    this.pausedVideoTime = undefined;
    return this;
}

_video = {};

// --- Private Store Methods --- //

/**
 * Pass in a video object with raw events and convert to a playable video with ticks
 * @args {object} video (Video object)
 * @return {object} A converted video object
 */
function _processEvents( video ){
    console.log('processing video events');
    var videoEvents = {};

    // *Takes events in eventQueue and creates a playable video
    var TICKINCREMENT = 1000;
    var totalTicks = Math.ceil(video.lastEventTime / TICKINCREMENT);
    var eventQueue = video.recordedEvents;

    // for each tick, determine how many events occurred
    for (var tick = 0; tick < totalTicks; tick++){
        var startOfTick = tick * TICKINCREMENT;
        var endOfTick = startOfTick + TICKINCREMENT;

        // Iterate over the key events
        var mskeys = Object.keys(eventQueue);
        mskeys.forEach(function(eventTime){
            // loop over ms eventTimes checking for matches within tick range
            if (eventTime >= startOfTick && eventTime < endOfTick){
                // {0: [{relativeTime: evt}, {relativeTime: evt}] }
                // {1: [{relativeTime: evt}] }
                // evenTime should be in ms relativeTime to tick

                var relativeTime = eventTime - startOfTick;

                if (tick in videoEvents){ // push event if tick is already present
                    // place event within tick with new relative time
                    videoEvents[tick][relativeTime] = eventQueue[eventTime];
                } else { // create tick with first event
                    // create object first
                    videoEvents[tick] = {};
                    videoEvents[tick][relativeTime] = eventQueue[eventTime];
                }
            }
        })
    }

    console.log('videoEvents');
    console.log(videoEvents);

    console.log('eventQueue');
    console.log(eventQueue);

    return videoEvents;
}
/**
 * Starts the video recording
 * Mutable function that changes the state of _video
 */
function startRecording(){
    if (typeof _video.isRecording === 'undefined' || _video.isRecording === false){
    // If there is no video and we are not recording currently, we should create a video
        _video = new Video(Date.now());
        _video.isRecording = true;
    }
}

/**
 * Mutable function registers the interval id to be able to stop the playback event loop
 * @param playbackIntervalId
 * @private
 */
function _registerIntervalId( playbackIntervalId ){
    _video.playbackIntervalId = playbackIntervalId;
}

/**
 * Mutable function registers the start time of when the video begins
 * @param playbackStartTime
 * @private
 */
function _registerPlaybackStartTime( playbackStartTime ){
    _video.playbackStartTime = playbackStartTime;
}

/**
 * Stops the video recording and stores a playable video
 * Mutable function that changes the state of _video
 */
function stopRecording(){
    if (_video.isRecording === true){
        // If there is no video and we are not recording currently, we should create a video
        _video.isRecording = false;
        _video.playableVideo = _processEvents(_video);
        _video.isReady = true;
    }
}

/**
 * Records the event fired by editor when changed
 * Mutable function that manipulates video state
 * @args {object} evt - The event fired by the brace editor to be recorded
 */
function recordEvent( evt ){
    if (_video.isRecording){

        // Calculate event time slot and store the event
        var eventTime = Date.now(),
            eventIndex = Math.floor((eventTime - _video.startTime));

        _video.recordedEvents[eventIndex] = evt.data;
        _video.lastEventTime = eventIndex;
    }
}

/**
 * Mutable functions changing the playback state of the video to true
 */
function _playbackVideo(){
    if (!_video.isRecording){
        console.log('changing isPlaying property in _video');
        _video.isPlaying = true;
    }
}
function _pauseVideo(){
    if (!_video.isRecording){
        console.log('changing isPlaying property in _video to false');
        _video.isPlaying = false;
    }
}

/**
 * Mutable function registering the video state after a pause
 * @private
 */
function _capturePausedVideoState( videoText ){
    _video.pausedVideoStateText = videoText;
}

/**
 * Mutable function registering the video time after a pause
 * @private
 */
function _capturePausedVideoTime( videoTime ){
    _video.pausedVideoTime = videoTime;
}

// --- Public Store Methods --- //
var CHANGE_EVENT = 'change';

var VideoStore = _.extend(EventEmitter.prototype, {
    // Change emitting events
    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },

    /**
     * @param {function} callback
     */
    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },

    /**
     * @param {function} callback
     */
    removeChangeListener: function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },

    /**
     * Returns the current video state
     * @returns {object} _video
     */
    getVideo: function(){
        return _video;
    },

    dispatcherIndex: FCDispatcher.register(function(payload) {
        var action = payload.action;
        var video = action.video || '';

        switch(action.actionType) {
            case FCConstants.START_RECORDING_VIDEO:
                startRecording();
                VideoStore.emitChange();
                break;
            case FCConstants.CODING_EVENT:
                recordEvent(payload.action.event);
                VideoStore.emitChange();
                break;
            case FCConstants.STOP_RECORDING_VIDEO:
                stopRecording();
                VideoStore.emitChange();
                break;
            case FCConstants.PLAYBACK_VIDEO:
                _playbackVideo();
                VideoStore.emitChange();
                break;
            case FCConstants.REGISTER_PLAYBACK_INTERVAL_ID:
                _registerIntervalId(payload.action.playbackIntervalId);
                VideoStore.emitChange();
                break;
            case FCConstants.REGISTER_PLAYBACK_START_TIME:
                _registerPlaybackStartTime(payload.action.playbackStartTime);
                VideoStore.emitChange();
                break;
            case FCConstants.PAUSE_VIDEO:
                _pauseVideo();
                VideoStore.emitChange();
                break;
            case FCConstants.PAUSED_VIDEO_STATE:
                _capturePausedVideoState(payload.action.videoText);
                VideoStore.emitChange();
                break;
            case FCConstants.PAUSED_VIDEO_TIME:
                _capturePausedVideoTime(payload.action.currentVideoTime);
                VideoStore.emitChange();
                break;

            // add more cases for other actionTypes
        }

        return true; // No errors. Needed by promise in Dispatcher.
    })
});


module.exports = VideoStore;





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
    this.recordedEvents = {};

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
 * Stops the video recording
 * Mutable function that changes the state of _video
 */
function stopRecording(){
    if (_video.isRecording === true){
        // If there is no video and we are not recording currently, we should create a video
        _video.isRecording = false;
        _video.playableVideo = _processEvents(_video);
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

// --- Public Store Methods --- //
var CHANGE_EVENT = 'change';

var VideoStore = _.extend(EventEmitter.prototype, {
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

            //case FCConstants.START_RECORDING_AUDIO:
            //    registerAudio(audio);
            //    VideoStore.emitChange();
            //    break;

            // add more cases for other actionTypes
        }

        return true; // No errors. Needed by promise in Dispatcher.
    })
});


module.exports = VideoStore;





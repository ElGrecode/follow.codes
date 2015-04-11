/**
 * Audio Store manages our audio data
 */

// --- Dependencies --- //
var _ = require('lodash');
var EventEmitter = require('events').EventEmitter;
var FCConstants = require('../constants/fc-constants');
var FCDispatcher = require('../dispatcher/fc-dispatcher');

// Managing a private audio data
var _audio = {};


// --- Private Store Methods --- //
/**
 * Mutable function registers a reference to a previously created audio object
 * @param {object} audio
 */
function _registerAudio( audio ){
    _audio = audio;
    _audio.isPlaying = false;
    console.log('the current audio->', _audio);
}

/**
 * Mutable function registers the url path of the audio blob in local storage
 * @param audioFile
 */
function _registerAudioFile( audioFile ){
    _audio.audioFile = audioFile;
    _audio.isReady = true;
}

/**
 * Mutable functions changing audio's isPlaying state
 */
function _playbackAudio(){
    _audio.isPlaying = true;
}
function _pauseAudio(){
    _audio.isPlaying = false;
}

// --- Public Store Methods --- //
var CHANGE_EVENT = 'change';

var AudioStore = _.extend(EventEmitter.prototype, {
    // Really the only thing we want to do is notify view of audio creation
    // Alternatively, if we were to ever have an audio visualizer, this might be something that we notify view
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
     * Returns the current audio state
     * @returns {object} _audio
     */
    getAudio: function(){
        return _audio;
    },

    dispatcherIndex: FCDispatcher.register(function(payload) {
        var action = payload.action;
        var audio = action.audio || '';

        switch(action.actionType) {
            case FCConstants.REGISTER_AUDIO:
                _registerAudio(audio);
                AudioStore.emitChange();
                break;

            case FCConstants.REGISTER_AUDIO_FILE:
                _registerAudioFile(action.audioFile);
                AudioStore.emitChange();
                break;

            case FCConstants.PLAYBACK_AUDIO:
                _playbackAudio();
                AudioStore.emitChange();
                break;

            case FCConstants.PAUSE_AUDIO:
                _pauseAudio();
                AudioStore.emitChange();
                break;

            //case FCConstants.START_RECORDING_AUDIO:
            //    createAudioVisualizer();
            //    AudioStore.emitChange();
            //    break;
            // add more cases for other actionTypes
        }

        return true; // No errors. Needed by promise in Dispatcher.
    })
});


module.exports = AudioStore;





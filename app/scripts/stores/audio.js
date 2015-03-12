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
function registerAudio( audio ){
    _audio = audio;
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

    dispatcherIndex: FCDispatcher.register(function(payload) {
        var action = payload.action;
        var text;
        var audio = action.audio || '';

        switch(action.actionType) {
            case FCConstants.REGISTER_AUDIO:
                registerAudio(audio);
                AudioStore.emitChange();
                break;

            //case FCConstants.START_RECORDING_AUDIO:
            //    registerAudio(audio);
            //    AudioStore.emitChange();
            //    break;

            // add more cases for other actionTypes
        }

        return true; // No errors. Needed by promise in Dispatcher.
    })
});


module.exports = AudioStore;





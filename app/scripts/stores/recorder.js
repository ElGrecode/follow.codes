/**
 * Recorder Store manages our recorder object and data
 */

// --- Dependencies --- //
var _ = require('lodash');
var EventEmitter = require('events').EventEmitter;
var FCConstants = require('../constants/fc-constants');
var FCDispatcher = require('../dispatcher/fc-dispatcher');

// Managing a private recording data
var _recorder = {};


// --- Private Store Methods --- //
/**
 * Mutable function registers a reference to a previously created recorder object
 * @param {object} recorder
 */
function registerRecorder( recorder ){
    _recorder = recorder;
    _recorder.recording = false;
}

function startRecording(){
    console.log('starting the recording from within store');
    _recorder.clear();
    _recorder.record();
}

function stopRecording(){
    console.log('stopping the recording');
    _processEvents()
}

// --- Public Store Methods --- //
var CHANGE_EVENT = 'change';

var RecorderStore = _.extend(EventEmitter.prototype, {
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
        var recorder = action.recorder || '';
        var text;

        switch(action.actionType) {
            case FCConstants.REGISTER_RECORDER:
                // todo: check to make sure we have a valid recording
                registerRecorder(recorder);
                RecorderStore.emitChange();
                break;

            case FCConstants.START_RECORDING_AUDIO:
                startRecording();
                RecorderStore.emitChange();
                break;

            case FCConstants.STOP_RECORDING:
                stopRecording(text);
                RecorderStore.emitChange();
                break;

            // add more cases for other actionTypes
        }

        return true; // No errors. Needed by promise in Dispatcher.
    })
});


module.exports = RecorderStore;





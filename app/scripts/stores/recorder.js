/**
 * Recorder Store manages our recorder object and data and through API, our audio
 */

// --- Dependencies --- //
var _ = require('lodash');
var EventEmitter = require('events').EventEmitter;
var FCActions = require('../actions/fc-actions');
var FCConstants = require('../constants/fc-constants');
var FCDispatcher = require('../dispatcher/fc-dispatcher');

// A recorder data object that manages the API for a recording
var _recorder = {};

//todo: move this visualization into the component directory
/**
 * Draw the completed audio into a wave graph
 * @param width
 * @param height
 * @param context
 * @param data
 */
function drawBuffer( width, height, context, data ) {
    console.log('drawing buffer');
    var step = Math.ceil( data.length / width );
    var amp = height / 2;
    context.fillStyle = "silver";
    context.clearRect(0,0,width,height);
    for(var i=0; i < width; i++){
        var min = 1.0;
        var max = -1.0;
        for (j=0; j<step; j++) {
            var datum = data[(i*step)+j];
            if (datum < min)
                min = datum;
            if (datum > max)
                max = datum;
        }
        context.fillRect(i,(1+min)*amp,1,Math.max(1,(max-min)*amp));
    }
}


// --- Private Store Methods --- //
/**
 * Callback function that allows manipulation of buffers
 * @param {object} blob (raw audio object)
 */
function exportBuffers( buffers ) {
    // todo: draw this audio recording on the screen
    // do I want to draw this for visual display?
    var canvas = document.getElementById( "wavedisplay" );
    drawBuffer( canvas.width, canvas.height, canvas.getContext('2d'), buffers[0] );

    // the ONLY time exportBuffers is called is right after a new recording is completed -
    // so here's where we currently should set up the download.
   _recorder.exportWAV( doneEncoding );
}

/**
 * Callback function that prepares and downloads raw audio file
 * @param {object} blob (raw audio object)
 */
function doneEncoding( blob ) {
    console.log(_recorder);
    console.log(blob);
    var audioPlaybackSrc = _recorder.setupDownload( blob, "Audio" + ((_recorder.recorderIndex<10)?"0":"") + _recorder.recorderIndex + ".wav" );
    FCActions.registerAudioFile(audioPlaybackSrc);
    _recorder.recorderIndex++;
}

/**
 * Mutable function registers a reference to a previously created recorder object and attach local state
 * @param {object} recorder
 */
function registerRecorder( recorder ){
    _recorder = recorder;
    _recorder.isAllowable = true;
    _recorder.isRecording = false;
    _recorder.phase = "unstarted";
    _recorder.recorderIndex = 0;
}

/**
 * Mutable function sets isAllowable state on recorder object
 */
function recorderNotAllowable(){
    _recorder.isAllowable = false;
}

/**
 * Starts the recording of the recorder object
 */
function startRecording(){
    if (!_recorder.isRecording){
        _recorder.clear();
        _recorder.record();
        _recorder.isRecording = true;
        _recorder.phase = "started";
    }
}

/**
 * A hook for starting/signalling the main phase of recording
 */
function startMainPhase(){
    _recorder.phase = "main";
}

/**
 * Stops the recording of the recorder object
 */
function stopRecording(){
    if (_recorder.isRecording){
        console.log('stopping recorder object');
        _recorder.stop();
        _recorder.getBuffers(exportBuffers);
        _recorder.isRecording = false;
    }
}

// --- Public Store Methods --- //
var CHANGE_EVENT = 'change';
var RecorderStore = _.extend(EventEmitter.prototype, {
    emitChange: function(){
        this.emit(CHANGE_EVENT);
    },

    /**
     * @param {function} callback
     */
    addChangeListener: function( callback ){
        this.on(CHANGE_EVENT, callback);
    },

    /**
     * @param {function} callback
     */
    removeChangeListener: function( callback ){
        this.removeListener(CHANGE_EVENT, callback);
    },

    getRecorder: function(){
        return _recorder;
    },

    getPhaseStatus: function(){
        return _recorder.phase;
    },

    dispatcherIndex: FCDispatcher.register(function(payload) {
        var action = payload.action;
        var recorder = action.recorder || '';

        switch(action.actionType) {
            case FCConstants.REGISTER_VAI:
                registerVAI(payload.rafId);
                RecorderStore.emitChange();
                break;

            case FCConstants.REGISTER_RECORDER:
                // todo: check to make sure we have a valid recording
                registerRecorder(recorder);
                RecorderStore.emitChange();
                break;

            case FCConstants.RECORDER_NOT_ALLOWABLE:
                recorderNotAllowable();
                break;

            case FCConstants.START_RECORDING_AUDIO:
                startRecording();
                RecorderStore.emitChange();
                break;

            case FCConstants.MAIN_PHASE_RECORDING:
                startMainPhase();
                RecorderStore.emitChange();
                break;

            case FCConstants.STOP_RECORDING_AUDIO:
                stopRecording();
                RecorderStore.emitChange();
                break;

            // add more cases for other actionTypes
        }
        return true; // No errors. Needed by promise in Dispatcher.
    })
});


module.exports = RecorderStore;





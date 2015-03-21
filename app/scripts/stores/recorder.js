/**
 * Recorder Store manages our recorder object and data and through API, our audio
 */

// --- Dependencies --- //
var _ = require('lodash');
var EventEmitter = require('events').EventEmitter;
var FCConstants = require('../constants/fc-constants');
var FCDispatcher = require('../dispatcher/fc-dispatcher');

// A recorder data object that manages the API for a recording
var _recorder = {};
// temp
function drawBuffer( width, height, context, data ) {
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

//_drawSpectrum: function(analyser) {
//    var that = this,
//        canvas = document.getElementById('canvas'),
//        cwidth = canvas.width,
//        cheight = canvas.height - 4,
//        meterWidth = 5, //width of the meters in the spectrum
//        gap = 6, //gap between meters
//        capHeight = 2,
//        meterNum = 12, //count of the meters
//        capYPositionArray = []; ////store the vertical position of hte caps for the preivous frame
//    ctx = canvas.getContext('2d'),
//        gradient = ctx.createLinearGradient(0, 0, 0, 10);
//    gradient.addColorStop(1, '#79218A');
//    gradient.addColorStop(0.6, '#ED2416');
//    gradient.addColorStop(0, '#ED2416');
//    var drawMeter = function() {
//        var array = new Uint8Array(analyser.frequencyBinCount);
//        analyser.getByteFrequencyData(array);
//        if (that.status === 0) {
//            //fix when some sounds end the value still not back to zero
//            for (var i = array.length - 1; i >= 0; i--) {
//                array[i] = 0;
//            };
//            allCapsReachBottom = true;
//            for (var i = capYPositionArray.length - 1; i >= 0; i--) {
//                allCapsReachBottom = allCapsReachBottom && (capYPositionArray[i] === 0);
//            };
//            if (allCapsReachBottom) {
//                cancelAnimationFrame(that.animationId); //since the sound is top and animation finished, stop the requestAnimation to prevent potential memory leak,THIS IS VERY IMPORTANT!
//                return;
//            };
//        };
//        var step = Math.round(array.length / meterNum); //sample limited data from the total array
//        ctx.clearRect(0, 0, cwidth, cheight);
//        for (var i = 0; i < meterNum; i++) {
//            var value = array[i * step];
//            if (capYPositionArray.length < Math.round(meterNum)) {
//                capYPositionArray.push(value);
//            };
//            //draw the cap, with transition effect
//            ctx.fillStyle = gradient; //set the filllStyle to gradient for a better look
//            ctx.fillRect(i * gap /*meterWidth+gap*/ , cheight - (value / 15) + capHeight, meterWidth, cheight); //the meter
//        }
//        that.animationId = requestAnimationFrame(drawMeter);
//    }
//    this.animationId = requestAnimationFrame(drawMeter);
//}


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
    _recorder.setupDownload( blob, "Audio" + ((_recorder.recorderIndex<10)?"0":"") + _recorder.recorderIndex + ".wav" );
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
    }
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

    dispatcherIndex: FCDispatcher.register(function(payload) {
        var action = payload.action;
        var recorder = action.recorder || '';

        switch(action.actionType) {
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





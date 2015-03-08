/**
 * Audio Store manages our audio layer
 * It spawns a web worker thread that it delegates
 */

// --- Dependency Requirements --- //
var _ = require('lodash');
var EventEmitter = require('events').EventEmitter;
// --- End Dependency Requirements --- //


// --- Audio Model Object --- //
var _audio = {
    audioContext: null,
    sound: null,
    audioSource: null,
    recorder: null
};
// --- End Audio Model Object --- //


// --- Audio Component Factories --- //
/**
 * Creates an AudioContext interface graph built from audio modules linked together
 * @return {object} AudioContext
 */
function createAudioContext(){
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    return new AudioContext();
}

/**
 * Creates a GainNode object representing an interface for change in volume
 * @param {object} audioContext (type: AudioContext)
 * @return {object} GainNode
 */
function createGainNode( audioContext ){
    return audioContext.createGain();
}

/**
 * Creates a MediaStreamAudioSourceNode object representing the audio source of the stream
 * @param {object, object} audioContext and stream (type: AudioContext, type: MediaStream)
 * @return {object} MediaStreamAudioSourceNode
 */
function createMediaStreamSource( audioContext, stream ){
    return audioContext.createMediaStreamSource(stream);
}

/**
 * Creates a Recorder object which spawns a background worker to record our audio output sound
 * @param {object} sound (type: GainNode)
 * @return {object} Recorder
 */
function createRecorder( sound ){
    return new Recorder(_audio.sound);
}
// --- End Audio Component Factories --- //


// --- Initializations --- //
/**
 * Mutable Function that initializes our audio components from a successful callback from MediaStream creation
 * @param {object} stream (type: MediaStream) object that will be used to initialize our audio object and components
 */
function initAudioComponents( stream ) {
    // Create a generic audio context object
    _audio.audioContext = createAudioContext();
    // Create a volume object representing the sound
    _audio.sound = createGainNode(_audio.audioContext);
    // Create a audioSource from our stream
    _audio.audioSource = createMediaStreamSource(_audio.audioContext, stream);

    // Connect the audioSource node input node with the gainNode sound output
    _audio.audioSource.connect(_audio.sound);

    // Convert to Mono?
    //audioInput = convertToMono( input );

    // Visual depiction options of Audio context (Needed?)
    //analyserNode = audioContext.createAnalyser();
    //analyserNode.fftSize = 2048;
    //_audio.sound.connect( analyserNode );

    // Not exactly sure what this does just yet, it appears to mute the destination node of our audio context,
    // but I don't know why right now
    //zeroGain = audioContext.createGain();
    //zeroGain.gain.value = 0.0;
    //_audio.sound.connect( zeroGain );
    //zeroGain.connect( audioContext.destination );



    // Creates Recorder object
    //_audio.recorder = new Recorder(_audio.sound);

    // More visual
    //updateAnalysers();
}

function initAudioStream() {
    // Determine and set browser related navigator media objects
    if (!navigator.getUserMedia)
        navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    if (!navigator.cancelAnimationFrame)
        navigator.cancelAnimationFrame = navigator.webkitCancelAnimationFrame || navigator.mozCancelAnimationFrame;
    if (!navigator.requestAnimationFrame)
        navigator.requestAnimationFrame = navigator.webkitRequestAnimationFrame || navigator.mozRequestAnimationFrame;

    // Request that a user allows mic input recording with some options
    navigator.getUserMedia(
        {
            "audio": {
                "mandatory": {
                    "googEchoCancellation": "false",
                    "googAutoGainControl": "false",
                    "googNoiseSuppression": "false",
                    "googHighpassFilter": "false"
                },
                "optional": []
            }
        }, initAudioComponents, function(e) {
            // todo: Handle errror / non-success
            console.log('Can not record without audio input');
            console.log(e);
        });
}

// Initialize Audio Stream on Window's load event
window.addEventListener('load', initAudioStream );



//************** //
// Don't use assign instead use _.extend from LoDash
// Example
//var FCDispatcher = _.extend(Dispatcher.prototype, {
//    //* Create our own event handlers
//    handleViewAction: function(action){
//        console.log('action', action);
//        this.dispatch({
//            source: 'VIEW_ACTION',
//            action: action
//        })
//    }
//})

// --- Public Store Methods --- //
//var AppDispatcher = require('../dispatcher/AppDispatcher');
//var EventEmitter = require('events').EventEmitter;
//var TodoConstants = require('../constants/TodoConstants');
//var assign = require('object-assign');

//var CHANGE_EVENT = 'change';
//
//var _todos = {}; // collection of todo items
//
///**
// * Create a TODO item.
// * @param {string} text The content of the TODO
// */
//function create(text) {
//    // Using the current timestamp in place of a real id.
//    var id = Date.now();
//    _todos[id] = {
//        id: id,
//        complete: false,
//        text: text
//    };
//}
//
///**
// * Delete a TODO item.
// * @param {string} id
// */
//function destroy(id) {
//    delete _todos[id];
//}
//

var AudioStore = _.extend(EventEmitter.prototype, {
    //* Create our own event emitters

    // todo: Really the only thing we want to do is notify view of audio creation
    // Alternatively, if we were to ever have an audio visualizer, this might be something that we notify view
    emitChange: function() {
        this.emit(CHANGE_EVENT);
    }
});



//var TodoStore = assign({}, EventEmitter.prototype, {
//
//    /**
//     * Get the entire collection of TODOs.
//     * @return {object}
//     */
//    getAll: function() {
//        return _todos;
//    },
//
//    emitChange: function() {
//        this.emit(CHANGE_EVENT);
//    },
//
//    /**
//     * @param {function} callback
//     */
//    addChangeListener: function(callback) {
//        this.on(CHANGE_EVENT, callback);
//    },
//
//    /**
//     * @param {function} callback
//     */
//    removeChangeListener: function(callback) {
//        this.removeListener(CHANGE_EVENT, callback);
//    },
//
//    dispatcherIndex: AppDispatcher.register(function(payload) {
//        var action = payload.action;
//        var text;
//
//        switch(action.actionType) {
//            case TodoConstants.TODO_CREATE:
//                text = action.text.trim();
//                if (text !== '') {
//                    create(text);
//                    TodoStore.emitChange();
//                }
//                break;
//
//            case TodoConstants.TODO_DESTROY:
//                destroy(action.id);
//                TodoStore.emitChange();
//                break;
//
//            // add more cases for other actionTypes, like TODO_UPDATE, etc.
//        }
//
//        return true; // No errors. Needed by promise in Dispatcher.
//    })
//
//});

module.exports = AudioStore;





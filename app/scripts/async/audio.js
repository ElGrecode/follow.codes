/**
 * Create and Ship Audio object
 * It spawns a web worker thread that it delegates
 */

// --- Dependencies --- //
var Recorder = require('./_recorder');
var FCActions = require('../actions/fc-actions');

// --- Audio Model Object --- //
var _audio = {
    audioContext: null,
    sound: null,
    audioSource: null
};

var _recorder = {};



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

    // Creates Recorder object
    _recorder = new Recorder(_audio.sound);

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
    // More visual
    //updateAnalysers();

    // Register our newly created audio and recorder
    FCActions.registerAudio(_audio);
    FCActions.registerRecorder(_recorder);
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
            // todo: Handle error / non-success
            FCActions.recorderNotAllowable();
            console.log('Can not record without audio input');
            console.log(e);
        });
}

// Initialize Audio Stream on Window's load event
window.addEventListener('load', initAudioStream );


module.exports = _audio;

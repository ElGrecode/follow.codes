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
    window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;
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


// Temporary

function updateAnalysers(time) {
    console.log(time);
    var analyserContext = null;
    if (!analyserContext) {
        var canvas = document.getElementById("analyser");
        canvasWidth = canvas.width;
        canvasHeight = canvas.height;
        analyserContext = canvas.getContext('2d');
    }

    // analyzer draw code here
    {
        var SPACING = 8;
        var BAR_WIDTH = 6;
        var numBars = Math.round(canvasWidth / SPACING);
        var freqByteData = new Uint8Array(analyserNode.frequencyBinCount);

        analyserNode.getByteFrequencyData(freqByteData);

        analyserContext.clearRect(0, 0, canvasWidth, canvasHeight);
        analyserContext.fillStyle = '#912590';
        analyserContext.lineCap = 'round';
        var multiplier = analyserNode.frequencyBinCount / numBars;
        var step = Math.round(freqByteData.length / numBars);
        // Draw rectangle for each frequency bin.
        for (var i = 0; i < numBars; ++i) {

            var value = freqByteData[i * step];
            var magnitude = 0;
            var offset = Math.floor( i * multiplier );
            for (var j = 0; j< multiplier; j++)
                magnitude += freqByteData[offset + j];
                magnitude = magnitude / multiplier;
                analyserContext.fillRect(i * SPACING, canvasHeight - (value / 15), BAR_WIDTH, 40);
        }
    }

    rafID = window.requestAnimationFrame( updateAnalysers );
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
    // CALL THE VISUALIZER HER PASSING IN THE AUDIOCONTEXT and
    //var visualizer = new Visualizer;
    //visualizer.visualize(_audio.audioContext, _audio.audioContext.createBuffer(2, 22050, 44100));

    analyserNode = _audio.audioContext.createAnalyser();
    analyserNode.fftSize = 2048;
    _audio.sound.connect( analyserNode );

    audioRecorder = new Recorder( _audio.sound );

    zeroGain = _audio.audioContext.createGain();
    zeroGain.gain.value = 0.0;
    _audio.sound.connect( zeroGain );
    zeroGain.connect( _audio.audioContext.destination );
    updateAnalysers();

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

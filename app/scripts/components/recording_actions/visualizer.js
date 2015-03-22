/** @jsx React.DOM */
var React = require('react');
var FCActions = require('../../actions/fc-actions');

// Stores
var RecorderStore = require('../../stores/recorder');
var AudioStore = require('../../stores/audio');

// Local cache for local calculations
var previousPhase = undefined;
var currentPhase = undefined;
var firstTime = undefined;
var analyserNode = null;
var zeroGain = null;
var analyserContext = null;

function _isBeginningPhase( currentPhase ){
    if (previousPhase === 'unstarted' && currentPhase === 'started') { return true; }
    else { return false; }
}

function _isMainPhase( currentPhase ){
    if (previousPhase === 'started' && currentPhase === 'main') { return true; }
    else { return false; }
}

var Visualizer = React.createClass({

    componentWillMount: function() {
        RecorderStore.addChangeListener(this._onChange);
    },

    _onChange: function(){
        currentPhase = RecorderStore.getPhaseStatus();

        // Handle each phase
        if ( _isBeginningPhase( currentPhase ) ){
            console.log('we are in the beginning phase');
            this._createAudioVisualizer();

            setTimeout(function(){
                FCActions.startMainPhaseRecording();
            }, 3000)
        } else if ( _isMainPhase( currentPhase ) ){
            console.log('main phase');
            // deregister event listener
        }
        previousPhase = currentPhase
    },

    _updateAnalysers: function(time) {
        // If we don't have a firstTime and time is a number
        if (!firstTime && !isNaN(parseFloat(time)) && isFinite(time)) { firstTime = time; }
        // Normalized time from first start of updating analysers
        if (time - firstTime > 5000) { return; }
        if (!analyserContext) {

            var canvas = this.refs.canvas.getDOMNode();
            canvasWidth = canvas.width;
            canvasHeight = canvas.height;
            analyserContext = canvas.getContext('2d');
        }

        var SPACING = 12;
        var BAR_WIDTH = 12;
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
            analyserContext.fillRect(i * (SPACING + 4), canvasHeight - (value / 10), BAR_WIDTH, 40);
        }


        window.requestAnimationFrame( this._updateAnalysers );
    },

    /**
     * Create a brief visualization of our in progress audio recording
     */
    _createAudioVisualizer: function(){
        console.log('creating audio visualizer.....')
        var audio = AudioStore.getAudio();
        analyserNode = audio.audioContext.createAnalyser();
        analyserNode.fftSize = 2048;
        audio.sound.connect( analyserNode );

        zeroGain = audio.audioContext.createGain();
        zeroGain.gain.value = 0.0;
        audio.sound.connect( zeroGain );
        zeroGain.connect( audio.audioContext.destination );
        this._updateAnalysers();
    },

    render: function(){
        return (
            <canvas id="analyser" ref="canvas" className="progress" width="500" height="20"></canvas>
        )
    }
});

module.exports = Visualizer;

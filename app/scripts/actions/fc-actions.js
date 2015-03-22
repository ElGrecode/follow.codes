var FCConstants = require('../constants/fc-constants');
var FCDispatcher = require('../dispatcher/fc-dispatcher');

var FCActions = {

    /**
     * Register a reference to the audio object
     * @param {object} audio
     */
    registerAudio: function( audio ){
        FCDispatcher.handleViewAction({
            actionType: FCConstants.REGISTER_AUDIO,
            audio: audio
        });
    },

    /**
     * Recorder not available for this user or browser
     */
    recorderNotAllowable: function(){
        FCDispatcher.handleViewAction({
            actionType: FCConstants.RECORDER_NOT_ALLOWABLE
        });
    },

    /**
     * Register a reference to the recording object
     * @param {object} recorder
     */
    registerRecorder: function( recorder ){
        FCDispatcher.handleViewAction({
            actionType: FCConstants.REGISTER_RECORDER,
            recorder: recorder
        });
    },

    /**
     * Starts the recording the events on the code editor
     */
    startRecordingVideo: function(){
        FCDispatcher.handleViewAction({
            actionType: FCConstants.START_RECORDING_VIDEO
        });
    },

    /**
    * Starts the recording the audio for the screencast
    */
    startRecordingAudio: function(){
        FCDispatcher.handleViewAction({
            actionType: FCConstants.START_RECORDING_AUDIO
        });
    },


    startMainPhaseRecording: function(){
        FCDispatcher.handleViewAction({
            actionType: FCConstants.MAIN_PHASE_RECORDING
        });
    },


    captureCodingEvent: function( evt ){
        FCDispatcher.handleViewAction({
            actionType: FCConstants.CODING_EVENT,
            event: evt
        });
    },

    /**
    * Stop recording the video
    */
    stopRecordingVideo: function(){
        FCDispatcher.handleViewAction({
            actionType: FCConstants.STOP_RECORDING_VIDEO
        });
    },

    /**
    * Handles stop recording audio
    */
    stopRecordingAudio: function(){
        FCDispatcher.handleViewAction({
            actionType: FCConstants.STOP_RECORDING_AUDIO
        });
    }
    //
    ///**
    // * Creates a playable video format that can be played by application
    // * @param {eventLog} The events that have been recorded and logged.
    // * @return {video} The index of the callback within the _callbacks array.
    // */
    //createVideoFormat: function( eventLog ){
    //    FCDispatcher.handleViewAction({
    //        actionType: FCConstants.CREATE_VIDEO_FORMAT,
    //        eventLog: eventLog
    //    });
    //}
};

module.exports = FCActions;

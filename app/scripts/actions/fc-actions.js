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
     * Register a reference to the recording object
     * @param {object} recording
     */
    registerRecorder: function( recorder ){
        FCDispatcher.handleViewAction({
            actionType: FCConstants.REGISTER_RECORDER,
            recorder: recorder
        });
    }


    ///**
    // * Register a reference to the recording object
    // */
    //startRecording: function(){
    //    FCDispatcher.handleViewAction({
    //        actionType: FCConstants.START_RECORDING
    //    });
    //},
    //
    //
    //
    ///**
    // * Stop recording the video
    // */
    //startRecording: function(){
    //    FCDispatcher.handleViewAction({
    //        actionType: FCConstants.START_RECORDING
    //    });
    //},
    //
    ///**
    // * Stop recording the video
    // */
    //stopRecording: function(){
    //    FCDispatcher.handleViewAction({
    //        actionType: FCConstants.STOP_RECORDING
    //    });
    //},
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

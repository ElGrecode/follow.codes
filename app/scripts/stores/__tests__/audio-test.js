jest.dontMock('../audio');
jest.dontMock('../../dispatcher/fc-dispatcher');

var AudioStore = require('../audio');
var FCConstants = require('../../constants/fc-constants');
var FCDispatcher = require('../../dispatcher/fc-dispatcher');
var AppDispatcher = require('../../dispatcher/dispatcher');

describe('AudioStoreEvents', function() {
    var callback;


    var registerAudio = {
        actionType: FCConstants.REGISTER_AUDIO,
        audio: require('../../async/audio')
    };

    var registerAudioFile = {
        actionType: FCConstants.REGISTER_AUDIO_FILE,
        audioFile: 'blobFile.wav'
    };

    var playbackAudio = {
        actionType: FCConstants.PLAYBACK_AUDIO
    };

    var pauseAudio = {
        actionType: FCConstants.PAUSE_AUDIO
    };

    beforeEach(function() {
        dispatcher = new AppDispatcher();
        callback = jest.genMockFunction();
    });
    //it('expects audio to be registered', function(){
    //    dispatcher.register(function(payload) {
    //        callback(payload);
    //    });
    //    di
    //
    //    expect(callback.mock.calls.length).toBe(1);
    //
    //    callback(registerAudio);
    //    var audio = AudioStore.getAudio();
    //    console.log(audio);
    //    expect(audio.isPlaying).toBe(false);

    //expect(callback.mock.calls.length).toBe(1);
    //expect(callback.mock.calls[0][0]).toBe(payload);

    //});

    it('expects an audio object to be registered', function() {
        FCDispatcher.handleViewAction(registerAudio);

        var audio = AudioStore.getAudio();
        expect(audio).toBeDefined();
        expect(audio.isPlaying).toBe(false);

    });

    it('expects an audio file object to be registered upon completion', function() {
        FCDispatcher.handleViewAction(registerAudioFile);

        var audio = AudioStore.getAudio();
        expect(audio.audioFile).toEqual('blobFile.wav');
        expect(audio.isReady).toBe(true);

    });

    it('should start playing audio when played', function() {
        FCDispatcher.handleViewAction(playbackAudio);

        var audio = AudioStore.getAudio();
        expect(audio.isPlaying).toBe(true);

    });

    it('should pause audio when paused', function() {
        FCDispatcher.handleViewAction(pauseAudio);

        var audio = AudioStore.getAudio();
        expect(audio.isPlaying).toBe(false);

    });





});

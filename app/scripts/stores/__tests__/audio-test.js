jest.dontMock('../audio');

describe('AudioStore', function() {

    var FCConstants = require('../../constants/fc-constants');
    var AppDispatcher;
    var AudioStore;
    var callback;

    var actionTodoCreate = {
        actionType: FCConstants.PAUSE_AUDIO
    };
    var actionTodoDestroy = {
        actionType: FCConstants.PLAYBACK_AUDIO,
    };

    beforeEach(function() {
        AppDispatcher = require('../../dispatcher/fc-dispatcher');
        console.log(AppDispatcher.register);
        AudioStore = require('../audio');
        callback = AppDispatcher.register.mock.calls[0][0];
    });

    it('registers a callback with the dispatcher', function() {
        expect(AppDispatcher.register.mock.calls.length).toBe(1);
    });

    it('registers aaaa callback with the dispatcher', function() {
        expect(AppDispatcher.register.mock.calls.length).toBe(1);
    });

});

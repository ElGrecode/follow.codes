/**
 * Player Store manages our playback synchronicity between audio and video
 */

// --- Dependencies --- //
var _ = require('lodash');
var EventEmitter = require('events').EventEmitter;
var FCConstants = require('../constants/fc-constants');
var FCDispatcher = require('../dispatcher/fc-dispatcher');

// Managing a private player state
var _player = {
    currentTime: 0
};


// --- Private Store Methods --- //
// Private store methods go here
function _changePlayTime( currentTime ){
    _player.currentTime = currentTime;
}

// --- Public Store Methods --- //
var CHANGE_EVENT = 'change';
var PlayerStore = _.extend(EventEmitter.prototype, {
    /**
     * Emitting change events
     */
    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },

    /**
     * @param {function} callback
     */
    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },

    /**
     * @param {function} callback
     */
    removeChangeListener: function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },

    /**
     * Returns the current player state
     * @returns {object} _player
     */
    getPlayer: function(){
        return _player;
    },

    dispatcherIndex: FCDispatcher.register(function(payload) {
        var action = payload.action;

        switch(action.actionType) {
            case FCConstants.CHANGE_PLAY_TIME:
                console.log('payload in player change', payload);
                _changePlayTime(payload.currentTime);
                PlayerStore.emitChange();
                console.log('emitting from playerStore...')
                break;

            // add more cases for other actionTypes
        }

        return true; // No errors. Needed by promise in Dispatcher.
    })
});


module.exports = PlayerStore;





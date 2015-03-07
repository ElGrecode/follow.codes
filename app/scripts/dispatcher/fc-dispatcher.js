var Dispatcher = require('./dispatcher.js');
var _ = require('lodash');


var FCDispatcher = _.extend(Dispatcher.prototype, {
    //* Create our own event handlers
    handleViewAction: function(action){
        console.log('action', action);
        this.dispatch({
            source: 'VIEW_ACTION',
            action: action
        })
    }
})

module.exports = FCDispatcher;

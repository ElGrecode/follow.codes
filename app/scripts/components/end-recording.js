var React = require('react');
var FCActions = require('../actions/fc-actions');

var EndRecording = React.createClass({
    propTypes: {
        onClick: React.PropTypes.func
    },

    handleClick: function(){
        FCActions.stopRecording();
        //FCActions.createVideoFormat();
    },

    render: function(){
        return (
            <input type="button" onClick={this.handleClick} value="End Recording" />
        )
    }
});

module.exports = EndRecording;

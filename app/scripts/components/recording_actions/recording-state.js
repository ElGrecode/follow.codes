/** @jsx React.DOM */
var React = require('react');

var RecordingState = React.createClass({
    propTypes: {
      isRecording: React.PropTypes.bool
    },

    render: function(){
        var recording = this.props.isRecording ? 'recording' : '';
        return (
            <div className={recording}>
                <i className="icon-circle"></i>
            </div>
        )
    }
});

module.exports = RecordingState;

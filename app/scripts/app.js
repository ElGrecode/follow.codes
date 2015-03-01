/** @jsx React.DOM */

var React = window.React = require('react'),
    CodePlayground = require('../components/code-playground'),
    mountNode = document.getElementById("app");

var FollowApp = React.createClass({
    getInitialState: function(){
        return {
            eventQueue: [],
            editor: {}
        };
    },
    updateEditor: function( evt ){
        // Don't rerender the application, silently update state
        this.state.eventQueue.push(evt.data);
    },
    registerEditor: function( editor ){
        this.state.editor = editor;
    },
    replayVideo: function(){
        var deltas = this.state.eventQueue;
        console.log(deltas);
        //setTimeout(function(){
        //    console.log()
        //}, 300)
        var document = this.state.editor.getSession().getDocument();
        deltas.forEach(function(deltaEvent, index){
            setTimeout(function(){
                document.applyDeltas([deltaEvent]);
            }, 250 * index);
        })
    },
    render: function() {
        return (
          <div>
              <CodePlayground updateEditor={this.updateEditor} registerEditorState={this.registerEditor} />
              <input type="button" onClick={this.replayVideo} value="replay" />
          </div>
        );
    }
});

React.render(<FollowApp />, mountNode);

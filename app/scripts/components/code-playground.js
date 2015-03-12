var ace = require('brace');
var React = require('react');
var FCActions = require('../actions/fc-actions');
require('brace/theme/monokai');
//require('brace/theme/github');
//require('brace/theme/tomorrow');
//require('brace/theme/kuroir');
//require('brace/theme/twilight');
//require('brace/theme/xcode');
//require('brace/theme/textmate');
//require('brace/theme/terminal');
//require('brace/theme/solarized_dark');
//require('brace/theme/solarized_light');


//include as many of the libraries
require('brace/mode/javascript');
//require('brace/mode/java');
//require('brace/mode/php');
//require('brace/mode/python');
//require('brace/mode/xml');
//require('brace/mode/ruby');
//require('brace/mode/sass');
//require('brace/mode/markdown');
//require('brace/mode/mysql');
//require('brace/mode/json');
//require('brace/mode/html');
//require('brace/mode/handlebars');
//require('brace/mode/golang');
//require('brace/mode/csharp');
//require('brace/mode/coffee');
//require('brace/mode/css');


var CodePlayground = React.createClass({
    propTypes: {
        mode  : React.PropTypes.string,
        theme : React.PropTypes.string,
        name : React.PropTypes.string,
        height : React.PropTypes.string,
        width : React.PropTypes.string,
        fontSize : React.PropTypes.number,
        showGutter : React.PropTypes.bool,
        onChange: React.PropTypes.func,
        value: React.PropTypes.string,
        onLoad: React.PropTypes.func
    },
    getDefaultProps: function() {
        return {
            name   : 'brace-editor',
            mode   : 'javascript',
            theme  : 'monokai',
            height : '100%',
            width  : '620px',
            fontSize  : 12,
            value: '',
            showGutter : true,
            onChange : null,
            onLoad : null,
            wrapBehaviour: false
        };
    },
    setInitialState: function(){
        return { queue: [''] }
    },
    captureCodingEvent: function(evt) {
        FCActions.captureCodingEvent(evt);
    },
    componentWillReceiveProps: function(nextProps) {
        this.editor = ace.edit(nextProps.name);
        this.editor.getSession().setMode('ace/mode/'+nextProps.mode);
        this.editor.setTheme('ace/theme/'+nextProps.theme);
        this.editor.setFontSize(nextProps.fontSize);
        this.editor.setWrapBehavioursEnabled(nextProps.wrapBehaviour);
        this.editor.setValue(nextProps.value);
        this.editor.renderer.setShowGutter(nextProps.showGutter);
        if (nextProps.onLoad) {
            nextProps.onLoad();
        }
    },

    render: function() {
        var divStyle = {
            width: this.props.width,
            height: this.props.height
        };
        return (<div id={this.props.name} onChange={this.captureCodingEvent} style={divStyle}></div>);
    },

    componentDidMount: function() {
        this.props.editor = this.editor;
        this.editor = ace.edit(this.props.name);
        this.editor.getSession().setMode('ace/mode/'+this.props.mode);
        this.editor.setTheme('ace/theme/'+this.props.theme);
        this.editor.setFontSize(this.props.fontSize);
        this.editor.on('change', this.captureCodingEvent);
        this.editor.setValue(this.props.value);
        this.editor.renderer.setShowGutter(this.props.showGutter);

        // Use editor as a mutable state
        this.props.registerEditorState(this.editor);
    }

});

module.exports = CodePlayground;

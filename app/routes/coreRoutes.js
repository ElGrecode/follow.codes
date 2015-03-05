var React = require('react/addons');
//console.log(React);
var FollowApp = React.createFactory(require('../scripts/components/FollowApp').FollowApp);

module.exports = function(app) {

    app.get('/', function(req, res){
        // Takes FollowApp main component and generates the markup of initial state
        var reactHtml = React.renderToString(FollowApp({}));

        // Output html rendered by react
        //console.log(reactHtml);
        res.render('index.ejs', {reactOutput: reactHtml});
    });

};

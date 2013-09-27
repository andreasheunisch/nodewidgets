
var passport = require('passport')


exports.registerExpressAppRoutes = function(app) {

	app.get('/demo', function(req, res) {
          res.render('demo');
	});

	app.get('/demo/dataviews', function(req, res) {
          res.render('demo_dataviews');
	});

	app.get('/demo/forbidden', function(req, res) {
          res.render('demo_forbidden');
	});

}



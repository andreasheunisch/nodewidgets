

var util = require('util');




var requireAuthenticated = function (req, res, next){
    if(req.isAuthenticated()){
        next();
    }else{
        console.log( 'Not allowed: redirect to login!');
        res.redirect('/demo/login');
    }
}


var requireReadPermission  = function (req, res, next){
    if(req.isAuthenticated() && req.session.passport.user.auth_username == "smith" ){
        next();
    }else{
        console.log( 'Unauthorized: redirect ...');
        res.redirect('/demo/forbidden');
    }
}



exports.registerExpressAppRoutes = function(app) {

	app.get('/demo/login', function(req, res) {
        res.render('demo_login');
	});


	app.get('/demo/restrictedarea/*', requireAuthenticated );

	app.get('/demo/restrictedarea/welcome', 
        function(req, res) {
            //console.log("req.isAuthenticated()" + req.isAuthenticated() );
            //console.log(" req = "+ util.inspect(req.session,false,null) );
            res.render('demo_restrictedarea_welcome', { user: req.session.passport.user.auth_username } );
	});

	app.get('/demo/restrictedarea/supersecretwebpage', requireReadPermission,
        function(req, res) {
            res.render('demo_restrictedarea_supersecretwebpage', { user: req.session.passport.user.auth_username } );
	});


}




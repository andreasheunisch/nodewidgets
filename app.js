
/**
 * Module dependencies.
 */

var express = require('express')
var http = require('http')
var path = require('path')
var fs = require('fs')
var nodewidgets = require('nodewidgets');
var pg = require('pg')
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;

var util = require('util');


var app = express();

passport.use(new LocalStrategy( {
    usernameField: 'usr',
    passwordField: 'pwd'
  },
  function(username, password, done) {
    console.log("LocalStrategy" );
    
    if (username == 'test' && password == 'test') {
        console.log( 'login accepted' );
        return done(null, username);
    }
    
    console.log( 'login refused' );
    return done(null, false, { message: 'Incorrect username/password.' } );
  }
));


passport.serializeUser(function(username, done) {
    //console.log("serializeUser " + username );
    done(null, { 'auth_username': username } );
});

passport.deserializeUser(function(user, done) {
    //console.log("deserializeUser ");
    //console.log(util.inspect(user,false,null));
    done(null, user.auth_username );
});



//~ 
//~ nodewidgets.db_oracle.connect( null, 
    //~ function() { console.log( "connected." ) },
    //~ function() { console.log( "Could not connect!" ) }    
//~ );




// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.configure(function() {

    app.use(express.static('public'));
    app.use(express.cookieParser());
    app.use(express.bodyParser());
    app.use(express.session({ secret: 'mYs3CrtpA55WrD' }));
    app.use(passport.initialize({ userProperty: 'usr' }));
    app.use(passport.session());
    app.use(app.router);

    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/nwdemo/view');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.methodOverride());



    app.use(express.static(path.join(__dirname, 'client')));

    
    // implicitely require and register all entries from ./pages
    fs.readdirSync(__dirname+'/nwdemo/model').forEach(function(file) {
        if (file.match("\.js$")) {
            console.log( "require " + file );
            require('./nwdemo/model/' + file).registerExpressAppRoutes(app);
        }
    });
  
});




http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});





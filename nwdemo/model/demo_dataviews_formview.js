
var nodewidgets  = require("nodewidgets");


var demotablewidget = new nodewidgets.formview_backend.FormView( {

    name: 'demo',

    url: '/demo/dataviews/formview',
    
    columnDefs: [
        { caption: 'Id', fldid:'pk_id' },
        { caption: 'Firstname', fldid:'s_firstname' },
        { caption: 'Lastname', fldid:'s_lastname'  }
    ],
    
    getData: function(options, fnSuccess, fnError ) {
        fnSuccess({
          pk_id       : 1234,
          s_firstname : 'Willi%E4',
          s_lastname  : 'Winzig'
        });
    }
});




exports.registerExpressAppRoutes = function(app) {

	demotablewidget.registerExpressAppRoutes(app);

	app.get( '/demo/dataviews/formview', function(req, res) {
       res.render('demo_dataviews_formview');
	});
	
}




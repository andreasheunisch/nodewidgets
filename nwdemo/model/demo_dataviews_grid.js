
var nodewidgets  = require("nodewidgets");
var passport  = require("passport");


var demotablewidget = new nodewidgets.gridview_backend.GridView( {

    name: 'demo',

    url: '/demo/dataviews/grid',
    
    columnDefs: [
        { caption: 'Count', fldid:'fld1' },
        { caption: 'X', fldid:'fld2', format: 'euroCent' },
        { caption: 'Y', fldid:'fld3', prefix:'Y = ', suffix: '€' }
    ],
    
    rowCount: 1000507,
    
    getRowCount: function(options, fnSuccess, fnError) {
        fnSuccess(this.rowCount);
    },
    
    getData: function(options, fnSuccess, fnError ) {
        
        nodewidgets.gridview_backend.prepareOptions(options);
        
        var result = []
        var start = options.offset * 1;
        var stop = Math.min(start + options.limit * 1, this.rowCount);

        for( var i = start; i< stop; i++ ) {
            result.push( { 'fld1': i*1+1, 'fld2': i*2.5, 'fld3':100-i } );
        }
        
        fnSuccess( result );
    }

});




exports.registerExpressAppRoutes = function(app) {

	demotablewidget.registerExpressAppRoutes(app);

	app.get( demotablewidget.url, 
	      function(req, res) {
            res.render('demo_dataviews_grid');
    });
}




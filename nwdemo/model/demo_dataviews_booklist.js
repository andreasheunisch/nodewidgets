
var nodewidgets  = require("nodewidgets");


var demotablewidget = new nodewidgets.gridview_backend.GridView( {

    name: 'demo',

    url: '/demo/dataviews/booklist',
    
    columnDefs: [
        { caption: 'Id',        fldid:'id' },
        { caption: 'Title',     fldid:'title' },        
        { caption: 'Author',    fldid:'author' },
        { caption: 'Price',     fldid:'price', format: 'euro' }
    ],
    
    
    
    sortfields: ["title"],
    
    
    
    getRowCount: function(options, fnSuccess, fnError) {
        nodewidgets.db_postgres.queryValue( "SELECT COUNT(*) AS RESULT FROM books", 
          [], fnSuccess, fnError 
        );
    },
    
    
    
    getData: function(options, fnSuccess, fnError ) {
        
        nodewidgets.gridview_backend.prepareOptions(options);
        
        var fieldnames = this.columnDefs.map( function(col) { return col.fldid } );
        var strSqlFields = fieldnames.join(", ");
        var strSqlSortFields = this.sortfields.join(", ");
        
        var strSql = "SELECT " + strSqlFields + 
            " FROM books " +
            " ORDER BY " + strSqlSortFields;
        
            
        nodewidgets.db_postgres.queryPage( strSql, options.offset, options.limit, [],
          function(result) {
            fnSuccess(result)
          },
          function(err) {
            fnError(err);
          }
        );
    }

});




exports.registerExpressAppRoutes = function(app) {

	demotablewidget.registerExpressAppRoutes(app);

	app.get( '/demo/dataviews/booklist', function(req, res) {
       res.render('demo_dataviews_booklist');
	});
	
}




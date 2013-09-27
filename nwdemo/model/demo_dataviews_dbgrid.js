
var nodewidgets  = require("nodewidgets");


var demotablewidget = new nodewidgets.gridview_backend.GridView( {

    name: 'demo',

    url: '/demo/dataviews/dbgrid',
    
    columnDefs: [
        { caption: 'Id',        fldid:'PK_ID' },
        { caption: 'Active',    fldid:'I_CONTROL', format: 'integerYesNo' },        
        { caption: 'Company',   fldid:'S_COMPANY' },
        { caption: 'CountryId', fldid:'FK_COUNTRYID' },
        { caption: 'RoutingId', fldid:'FK_ROUTINGID' }
    ],
    
    rowformat: 'nwdemo_largeaccountstatus',
    
    sortfields: ["PK_ID"],
    
    
    getRowCount: function(options, fnSuccess, fnError) {
        nodewidgets.db_oracle.queryValue( "SELECT COUNT(*) AS RESULT FROM t_userlist", 
          [], fnSuccess, fnError 
        );
    },
    
    getData: function(options, fnSuccess, fnError ) {
        
        nodewidgets.gridview_backend.prepareOptions(options);
        
        var fieldnames = this.columnDefs.map( function(col) { return col.fldid } );
        var strSqlFields = fieldnames.join(", ");
        var strSqlSortFields = this.sortfields.join(", ");
        
        var strSql = "SELECT " + strSqlFields + 
              ", ROW_NUMBER() OVER(ORDER BY " + strSqlSortFields + ") AS rnum " +
            "FROM t_userlist " +
            "ORDER BY " + strSqlSortFields;
        
            
        nodewidgets.db_oracle.queryPage( strSql, options.offset, options.limit, [],
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

	app.get( '/demo/dataviews/dbgrid', function(req, res) {
       res.render('demo_dataviews_dbgrid');
	});
	
}




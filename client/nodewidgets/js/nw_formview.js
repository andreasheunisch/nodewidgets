

var module = angular.module('nodewidgets');


module.controller( "NWFormViewCtrl", function($scope, $http) {

    $scope.columns = [];
    $scope.columnheaders =  [];
    $scope.columnids =  [];
    $scope.rowFormat = null;
    $scope.rowLink = null;
    $scope.formdata = {};
    $scope.serviceurl = '/unset';
    

    $scope.reload = function() {
        
        $http.get( $scope.serviceurl + '/metadata/json' ).success( function(data) {
            $scope.setColumns(data.columns);
        }); 
        
        $http.get( $scope.serviceurl + '/formdata/json' ).success( function(data) {
            $scope.formdata = data.data;
        });
        
    };
    
    
    $scope.setColumns = function(columns) {
        $scope.columnids = columns.map( function(col) { return col.fldid } );
        $scope.columnheaders = columns.map( function(col) { return col.caption } );
        
        $scope.columns = {};
        for (var i=0; i<columns.length; i++ ) {
          $scope.columns[columns[i].fldid] = columns[i];
        }
    };
    
    
    
    $scope.prepareValue = function(colid, rawvalues) {
        var value = rawvalues[colid];
        var coldef = $scope.columns[colid];
        
        if (coldef.format) {
            var filterFn = nw_valuefilters[coldef.format];
            if (filterFn) {
                value = filterFn(value);
            } else {
                console.error( "No such valuefilter: " + coldef.format + " !" );
            }
        }
        
        if (coldef.prefix) {
            value = '' + coldef.prefix + value;
        }
        if (coldef.suffix) {
            value = '' + value + coldef.suffix;
        }
        return value;
    };
    
});


module.directive( 'nwformview', function() {
    return {
        replace: true,
        restrict: 'E',
        transclude: 'element',

        link: function(scope,element,attrs) {
      
            scope.title = attrs.title || '';
            scope.serviceurl = attrs.serviceurl || '#';  
            console.log("url="+attrs.serviceurl );
            scope.reload();
        },
        
        template: '<form class="form-horizontal" >' +
                    '<h2>{{title}}</h2>' +
                    '<div class="control-group" ng-repeat="col in columns">' +
                      '<label class="control-label" for="{{col.fldid}}">' +
                        '{{col.caption}}' +
                      '</label>' +
                      '<div class="controls">' +
                        '<span class="input-xlarge uneditable-input">{{prepareValue(col.fldid, formdata)}}</span>' +
                      '</div>' +
                    '</div>' +
                  '</form>'
    }
});


module.directive( 'nwformviewrefresbtn', function() {
    return {
        replace: true,
        restrict: 'E',
        transclude: 'element',
        
        template: '<button class="btn btn-link nw-float-right" ng-click="reload()" ><i class="icon-refresh" ></i></button>'
    }
});





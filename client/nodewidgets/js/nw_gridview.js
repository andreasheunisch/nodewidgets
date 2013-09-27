
var module = angular.module('nodewidgets');


module.controller( "NWGridViewCtrl", function($scope, $http) {

    $scope.columns = [];
    $scope.columnheaders =  [];
    $scope.columnids =  [];
    $scope.rowFormat = null;
    $scope.rowLink = null;
    
    $scope.totalRowCount = 0;
    $scope.rowdata = [];
    
    $scope.isPaged = true;
    $scope.pageSize = 10;
    $scope.numPages = 1;
    $scope.currentPage = 0;
    $scope.pagerNumPages = 7;
            

    $scope.reload = function() {
        console.log("refresh listwidget from " );
        console.log($scope.serviceurl);
            
        var httpcfg = {};
        if ($scope.isPaged) {
            httpcfg = {
                params: {
                    offset: $scope.pageSize * $scope.currentPage,
                    limit: $scope.pageSize
                }
            };
        }
        
        
        $http.get( $scope.serviceurl + '/metadata/json' ).success( function(data) {
            $scope.setColumns(data.columns);
            $scope.setTotalRowCount(data.rowcount);
            $scope.rowFormat = data.rowformat;
            console.log("scope.rowFormat=" + $scope.rowFormat);
        }); 
        
        $http.get( $scope.serviceurl + '/tabledata/json', httpcfg ).success( function(data) {
            $scope.rowdata = data.data;
        });
        
    };
    

    $scope.setTotalRowCount = function(rowCount) {
        $scope.totalRowCount = rowCount;
        if ($scope.isPaged) {
            $scope.recalculateNumPages();
        }
    };
    
      
    $scope.recalculateNumPages = function() {
        $scope.numPages = Math.ceil( $scope.totalRowCount / $scope.pageSize );
    };
    
    
    $scope.setColumns = function(columns) {
        $scope.columnids = columns.map( function(col) { return col.fldid } );
        $scope.columnheaders = columns.map( function(col) { return col.caption } );
        
        $scope.columns = {};
        for (var i=0; i<columns.length; i++ ) {
          $scope.columns[columns[i].fldid] = columns[i];
        }
    };
    
    
    $scope.getMetaData = function() {
        console.log("GET url="+$scope.serviceurl + '/metadata/json' );
        $http.get( $scope.serviceurl + '/metadata/json' ).success( function(data) {
            $scope.metadata = data;
        });
    };
    

    $scope.firstPage = function () {
        $scope.currentPage = 0;
        $scope.reload();
    };


    $scope.lastPage = function () {
        $scope.currentPage = $scope.numPages - 1;
        $scope.reload();
    };


    $scope.prevPage = function () {
        if ($scope.currentPage > 0) {
            $scope.currentPage--;
            console.log("prev page " + $scope.currentPage);
            $scope.reload();
        }
    };
    
    $scope.nextPage = function () {
        if ($scope.currentPage < $scope.numPages - 1 ) {
            $scope.currentPage++;
            console.log("next page " + $scope.currentPage);
            $scope.reload();
        }
    };
    
    $scope.setPage = function () {
        $scope.currentPage = this.n;
        console.log("set page " + $scope.currentPage);
        $scope.reload();
    };
    
    $scope.range = function (start, end) {
        if (!end) {
            end = start;
            start = 0;
        }
        var ret = [];
        for (var i = start; i < end; i++) {
            ret.push(i);
        }
        return ret;
    };
    
    $scope.pagerRange = function() {
        var d = Math.floor($scope.pagerNumPages/2)-1;
        var start = $scope.currentPage - d;
        if (start < 1) {
            start = 1;
        }
        var stop = start + $scope.pagerNumPages - 2;
        if (stop > $scope.numPages-1) {
            stop = $scope.numPages-1;
            if (stop - $scope.pagerNumPages+2 > 0) {
                start = stop - $scope.pagerNumPages+2;
            }
        }
        return $scope.range(start,stop);
    };
    
    $scope.goToPage = function (n) {
        $scope.currentPage = n;
        console.log("go to page " + $scope.currentPage);
        $scope.reload();
    };            
            
            
    $scope.prepareValue = function(colid, rawvalues) {
        var value = rawvalues[colid];
        var coldef = $scope.columns[colid];
        //console.log(value);
        
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
    
    
    $scope.prepareRowCss = function(row) {
      var rowFormatterFn = nw_rowformat[$scope.rowFormat];
      if (rowFormatterFn) {
        var cssClasses = rowFormatterFn(row);
        return cssClasses;
      }
      return '';
    };
       

});



module.directive( 'nwgridview', function() {
    return {
        replace: true,
        restrict: 'E',
        transclude: 'element',

        link: function(scope,element,attrs) {
      
            scope.title = attrs.title || '';
            scope.serviceurl = attrs.serviceurl || '#';  
            console.log("url="+attrs.serviceurl );
            
            scope.currentPage = attrs.page || 0;
            scope.reload();
        },
        
        
        template: '<div>' +
                        '<h2>{{title}}</h2>' +
                        '<table class="table table-condensed table-bordered" style="background:white">' +
                            '<tr>' +
                                '<th ng-repeat="colheader in columnheaders">{{colheader}}</th>' +
                            '</tr>' +
                            '<tr ng-repeat="row in rowdata" class="{{prepareRowCss(row)}}" >' +
                                '<td ng-repeat="colid in columnids">{{prepareValue(colid, row)}}</td>' +
                            '</tr>' +
                        '</table>' +
                  '</div>'
    }
});


module.directive( 'nwgridviewpager', function() {
    return {
        replace: true,
        restrict: 'E',
        transclude: 'element',
        
        link: function(scope,element,attrs) {
          scope.pagerNumPages = attrs.numpages || 7;
        },
       
        template: 
                        '<span class="pagination pagination-small" >' +
                            '<ul>' +
                                '<li ng-class="{disabled: currentPage == 0}" >' +
                                    '<a href ng-click="prevPage()" class="nw-pager-btn">«</a>' +
                                '</li>' + 
                                '<li ng-class="{disabled: currentPage == 0}">' +
                                    '<a href ng-click="firstPage()" class="nw-pager-btn" >1 ..</a>' +
                                '</li>' + 
                                '<li ng-repeat="n in pagerRange()" ng-click="setPage()" ng-class="{active: n == currentPage}" >' +
                                    '<a href ng-click="goToPage({{n}})" class="nw-pager-btn">{{n + 1}}</a>' + 
                                '</li>' + 
                                '<li ng-class="{disabled: currentPage + 1 == numPages}">' +
                                    '<a href ng-click="lastPage()" class="nw-pager-btn">.. {{numPages}}</a>' +
                                '</li>' + 
                                '<li ng-class="{disabled: currentPage + 1== numPages}">' + 
                                    '<a href ng-click="nextPage()" class="nw-pager-btn">»</a>' + 
                                '</li>' +
                            '</ul>' + 
                        '</span>'
    }
});



module.directive( 'nwgridviewpagectrl', function() {
    return {
        replace: true,
        restrict: 'E',
        transclude: 'element',
        
        link: function(scope,element,attrs) {
          scope.setPageSize = function(newSize) {
            if (newSize < 0) {
              newSize = scope.totalRowCount;
            }
            scope.pageSize = newSize;
            scope.recalculateNumPages();
            scope.currentPage = 0;
            scope.reload();
          };
        },
        
        template: '<span class="btn-group nw-float-right" >' +
            '<button class="btn btn-link dropdown-toggle" data-toggle="dropdown">Show {{pageSize}} reocords<span class="caret"></span></button>' +
            '<ul class="dropdown-menu">' +
              '<li><a ng-click="setPageSize(5)">5</a></li>' +
              '<li><a ng-click="setPageSize(10)">10</a></li>' +
              '<li><a ng-click="setPageSize(20)">20</a></li>' +
              '<li><a ng-click="setPageSize(50)">50</a></li>' +
              '<li><a ng-click="setPageSize(100)">100</a></li>' +
              '<li><a ng-click="setPageSize(-1)">show all</a></li>' +
            '</ul>' +
          '</span>'
    }
});


module.directive( 'nwgridviewcurrentpage', function() {
    return {
        replace: true,
        restrict: 'E',
        transclude: 'element',
        
        template: '<span ><div class="label label-default" >Page {{currentPage + 1}}/{{numPages}}</div></span>'
    }
});



module.directive( 'nwgridviewnumrows', function() {
    return {
        replace: true,
        restrict: 'E',
        transclude: 'element',
        
        template: '<span ><div class="label label-default" >{{totalRowCount}} rows found</div></span>'
    }
});


module.directive( 'nwgridviewrefresbtn', function() {
    return {
        replace: true,
        restrict: 'E',
        transclude: 'element',
        
        template: '<button class="btn btn-link nw-float-right" ng-click="reload()" ><i class="icon-refresh" ></i></button>'
    }
});


module.directive( 'nwgridviewsearchbar', function() {
    return {
        replace: true,
        restrict: 'E',
        transclude: 'element',
        
        link: function(scope,element,attrs) {
            scope.searchBarCaption = attrs.caption || 'Search:';
        },
        
        /*template: '<span style="padding: 8px; text-align:right">' +
          '<span>{{searchBarCaption}}</span>' +
            '<input style="margin: 2px" type="text" class="input-medium search-query"></input>' +
          '' +
          '<button class="btn" ><i class="icon-search"></i></button>' +
          '</span>'
        */  
          
        template: '<span class="form-search ">' + 
          '<div class="input-prepend">' +
            '<button type="submit" class="btn">{{searchBarCaption}}</button>' +
            '<input type="text" class="search-query">' +
          '</div>' +
        '</span>'


    }
});



        
        





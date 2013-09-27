

var module = angular.module('nodewidgets');



module.directive( 'nwloginform', function() {
    return {
        replace: true,
        restrict: 'E',
        transclude: 'element',
        
        scope: {
            serviceurl: '@'
        },
        
        template: '<form action="{{serviceurl}}" method="post" class="form-horizontal" >' +
                    '<div class="control-group">' +
                      '<label class="control-label" for="usr">Name</label>' +
                      '<div class="controls">' +
                        '<input type="text" name="usr" placeholder="User">' +
                      '</div>' +
                    '</div>' +
                    '<div class="control-group">' +
                      '<label class="control-label" for="pwd">Password</label>' +
                      '<div class="controls">' +
                        '<input type="password" name="pwd" placeholder="Password">' +
                      '</div>' +
                    '</div>' +
                    '<div class="control-group">' + 
                      '<div class="controls">' + 
                        '<label class="checkbox">' +
                          '<input type="checkbox" /> Remember me' +
                        '</label>' +
                        '<button type="submit" class="btn">Sign in</button>' +
                      '</div>' +
                    '</div>' +
                  '</form>'
    }
});



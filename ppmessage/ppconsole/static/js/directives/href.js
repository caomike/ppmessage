//
// @description
// < a ng-href="http://www.baidu.com" /> : => open `http://www.baidu.com` by replace current one
// < a ng-href="http://www.baidu.com" yv-href-blank /> : => open `http://www.baidu.com` in new window
//
( function() {

    angular.module( "this_app" ).directive( "yvHrefBlank" , href );

    function href() {
        
        return {
            
            restrict: 'A', // only matches attribute name
            
            link: function( scope, element, attrs ) {
                element.attr( "target", "_blank" );
            }
            
        };
        
    }
    
} )();

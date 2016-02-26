ppmessageModule.directive("yvViewPosition", [
    "$timeout",
function ($timeout) {

    function _link($scope, $element, $attr) {
        var _position, _center, _map, _marker;

        function _show_map(_center, _zoom) {
            return new AMap.Map("container", {
                view: new AMap.View2D({
                    center: _center,
                    zoom: _zoom
                })
            });
        }

        function _show_maker(_center, _map) {
            var _options = {
                map: _map,
                position: _center,
                zIndex: 3,
                offset: new AMap.Pixel(-9, -31),
                title: "",
                content: '<div style="background: url(http://api.amap.com/Public/css/mapcreator/marker.png)' +
                    'no-repeat; height: 31px; width: 28px; background-position: -11px -5px;"></div>'
            };
            return new AMap.Marker(_options);
        }

        function _init_map() {
            if (!$scope.position) {
                return;
            }

            _position = JSON.parse($scope.position);
            _center = new AMap.LngLat(_position.lng, _position.lat);
            _map = _show_map(_center, _position.zoom);
            _marker = _show_maker(_center, _map);
        }

        $scope.$on("$destroy", function () {
            if (_map) {
                _map.destroy();
            }
        });

        _init_map();
    }

    return {
        restrict: "E",
        scope: {
            position: "="
        },
        template: "<div id='container' style='height: 100%;'></div>",
        link: _link
    };
}]);

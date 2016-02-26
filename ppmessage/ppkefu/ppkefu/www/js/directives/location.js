ppmessageModule.directive("yvLocation", [
    "$timeout",
    "yvSys",
function ($timeout, yvSys) {

    function _link($scope, $element, $attr) {

        var _marker_icon = "http://webapi.amap.com/images/marker_sprite.png",
            map = null,
            _marker = null;

        function _add_marker(_pos) {
            var _options = {
                map: map,
                position: _pos,
                zIndex: 3,
                icon: _marker_icon
            };
            _marker = new AMap.Marker(_options);
            return _marker;
        }

        function _set_address(_center) {
            AMap.service(["AMap.Geocoder"], function () {
                var map_geocoder = new AMap.Geocoder({
                    radius: 1000,
                    extensions: "all"
                });
                map_geocoder.getAddress(_center, function (status, result) {
                    if (status === "complete" && result.info === "OK") {
                        $timeout(function () {
                            $scope.$parent.gpslocation.address = result.regeocode.formattedAddress;
                        });
                    }
                });
            });
        }

        function _map_event() {
            var _center = map.getCenter();
            $scope.$parent.current_pos.lat = _center.lat;
            $scope.$parent.current_pos.lng = _center.lng;
            $scope.$parent.current_pos.zoom = map.getZoom();
            _set_address(_center);

            if (_marker) {
                _marker.setPosition(new AMap.LngLat(_center.lng, _center.lat));
            } else {
                _add_marker(_center);
            }
        }

        function _init_map(_lng, _lat) {
            var _center = new AMap.LngLat(_lng, _lat);
            map = new AMap.Map("map-container", {
                center: _center,
                level: 12
            });

            if (map) {
                AMap.event.addListener(map, "dragging", function (e) {
                    _map_event();
                });

                AMap.event.addListener(map, "zoomchange", function (e) {
                    _map_event();
                });
            }
            $scope.$parent.current_pos.lng = _lng;
            $scope.$parent.current_pos.lat = _lat;
            _set_address(_center);
            _add_marker(_center);
        }

        function _location_success(_pos) {
            var _lat = _pos.coords.latitude,
                _lng = _pos.coords.longitude;

            _init_map(_lng, _lat);
        }

        function _location_error(error) {
            if (error.code === 1) {
                $timeout(function () {
                    $scope.gpslocation.deny_error = true;
                });
            }
        }

        function _gps_location() {
            var _options = {
                timeout: 20000,
                enableHighAccuracy: true
            };
            navigator.geolocation.lastPosition = null;
            navigator.geolocation.getCurrentPosition(_location_success, _location_error, _options);
        }

        function _ip_to_city() {
            map = new AMap.Map("map-container");
            map.plugin(["AMap.CitySearch"], function () {
                //实例化城市查询类
                var citysearch = new AMap.CitySearch();
                //自动获取用户IP，返回当前城市
                citysearch.getLocalCity();
                //citysearch.getCityByIp("123.125.114.*");
                AMap.event.addListener(citysearch, "complete", function (result) {
                    if (result && result.city && result.bounds) {
                        var citybounds = result.bounds, _center;
                        map.setBounds(citybounds);
                        _center = map.getCenter();
                        _add_marker(_center);
                    } else {
                        console.log(result);
                    }
                });

                AMap.event.addListener(citysearch, "error", function (result) {
                    console.log(result.info);
                });

                AMap.event.addListener(map, "dragging", function (e) {
                    _map_event();
                });

                AMap.event.addListener(map, "zoomchange", function (e) {
                    _map_event();
                });

            });

            //AMap.event.addListener(mapObj, 'click', _add_marker);
        }

        function _init() {
            if (yvSys.in_mobile()) {
                _gps_location();
            } else {
                _ip_to_city();
            }
        }

        $scope.$on("$destroy", function () {
            if (map) {
                map.destroy();
                map = null;
            }
        });

        _init();

    }

    return {
        restrict: "E",
        template: '<div id="map-container" style="height: 100%;" data-tap-disabled="true"></div>',
        link: _link
    };
}]);

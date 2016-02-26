ppmessageModule.directive("yvLocationMessage", [
    "yvAPI",
    "yvLink",
    "yvSys",
function (yvAPI, yvLink, yvSys) {

    function link($scope, $element, $attrs, messageCtrl) {

        function renderImage(url) {
            var img = $element.find("img")[0];
            
            if (arguments !== 0 && url) {
                $scope.message.file = url;
            }
            
            img.src = yvLink.get_message_location_image($scope.message);
            messageCtrl.scrollBottom();
        }
        
        function setAddress(message) {
            var p = $element[0].querySelector("p.address"),
                position,
                center;

            if (message.address) {
                p.innerHTML = message.address;
                return;
            }
            
            position = JSON.parse(message.body),
            center = new AMap.LngLat(position.lng, position.lat);
            
            AMap.service(["AMap.Geocoder"], function () {
                var map_geocoder = new AMap.Geocoder({
                    radius: 1000,
                    extensions: "all"
                });
                map_geocoder.getAddress(center, function (status, result) {
                    if (status === "complete" && result.info === "OK") {
                        message.address = result.regeocode.formattedAddress;
                        p.innerHTML = message.address;
                    }
                });
            });
        }
        
        function init(message) {
            var body, url;
            
            setAddress(message);

            // message is already downloaded, do nothing.
            if (message.file) {
                renderImage();
                return;
            }

            body = JSON.parse(message.body);
            body.zoom = Math.round(body.zoom);
            url = yvAPI.get_amap_url(body);

            message.mime = "image/jpeg";
            
            if (yvSys.in_mobile_app()) {
                yvAPI.download_file(url, null, function (file) {
                    renderImage(file.name);
                });
            } else {
                renderImage(url);
            }
            
            return;
        }

        init($scope.message);
    }
    
    return {
        restrict: "E",
        replace: true,
        require: "^yvMessage",
        scope: {
            message: "="
        },
        link: link,
        template: '<div class="yv-chat-location">' +
            '<img>' +
            '<div class="yv-address">' +
            '<p class="address"></p>' +
            '</div>' +
            '</div>'
    };

}]);

angular.module("this_app")
    .controller("StatisticsOverviewCtrl", function($scope, $state, $timeout, $translate, $stateParams, yvUser, yvAjax, yvUtil, yvTransTags, yvConstants, yvLogin) {

        $scope.card_number = {};
        var _realtime_line = null;
        var _history_line = null;
        var _history_mode = "customer";
        
        var randomScalingFactor = function() {return Math.round(Math.random()*500)};

        var _draw_card = function() {
            var _c = yvAjax.ppconsole_get_overview_number(yvUser.get_team().uuid);
            _c.success(function(data) {
                if (data.error_code != 0) {
                    return;
                }
                for (var n in data.number) {
                    if (data.number.hasOwnProperty(n)) {
                        $scope.card_number[n] = data.number[n];
                    }
                }
            });
        };

        var _draw_realtime = function(_number) {
            if(_realtime_line != null) {
                _realtime_line.destroy();
                _realtime_line = null;
            }
            
            var _data = {
                labels : [],
                datasets : [{
                    fillColor : "rgba(151,187,205,0.2)",
                    strokeColor : "rgba(151,187,205,1)",
                    pointColor : "rgba(151,187,205,1)",
                    pointStrokeColor : "#fff",
                    pointHighlightFill : "#fff",
                    pointHighlightStroke : "rgba(151,187,205,1)",
                    data : []
                }]
            };
            
            var _target = document.getElementById("realtime-statistics");
            var ctx = _target.getContext("2d");
            
            for(var i in _number) {
                _data.labels.push(i+"");
                _data.datasets[0].data.push(_number[i+""][i+""])
            }
            
            _realtime_line = new Chart(ctx).Line(_data, {
                tooltipTemplate:"<%= value %>",
                responsive: true,
                animationStep: 40});
        };

        var _draw_history = function(_begin, _end, _number) {
            var _data = {
                labels : [],
                datasets : [{
                    fillColor : "rgba(151,187,205,0.2)",
                    strokeColor : "rgba(151,187,205,1)",
                    pointColor : "rgba(151,187,205,1)",
                    pointStrokeColor : "#fff",
                    pointHighlightFill : "#fff",
                    pointHighlightStroke : "rgba(151,187,205,1)",
                    data : []
                }]
            };

            var _range = moment.range(_begin, _end);
            var _label = [];
            _range.by("days", function(m) {
                _data.labels.push(m.format("MM-DD"));
                _data.datasets[0].data.push(_number[m.format("YYYY-MM-DD")]);
            });
            
            if(_history_line) {
                _history_line.destroy();
                _history_line = null;
            }

            var _target = document.getElementById("history-statistics");
            var ctx = _target.getContext("2d");
            _history_line = new Chart(ctx).Line(_data, {
                tooltipTemplate:"<%= value %>",
                responsive: true,
                animationStep: 40});
            
        };
        
        var _highlight = function($event) {
            var _l = angular.element($event.target).parent().parent().children();
            angular.forEach(_l, function(_item) {
                if (angular.element(_item).hasClass("active")) {
                    angular.element(_item).removeClass("active");
                }
            });

            if (!angular.element($event.target).parent().hasClass("active")) {
                angular.element($event.target).parent().addClass("active");
            }
        };

        var _get_realtime_number = function(mode) {
            var _f = yvAjax["ppconsole_get_real_time_" + mode + "_number"];
            var _d = _f(yvUser.get_team().uuid);
            _d.success(function(data) {
                if (data.error_code == 0) {
                    _draw_realtime(data.number);
                }
            });
            _d.error(function(data) {
                console.error(data);
            });
        };

        var _select_history_date = function(begin, end, mode) {
            var _f = yvAjax["ppconsole_get_" + mode + "_number_by_range"];
            var _d = _f(yvUser.get_team().uuid, begin.format("YYYY-MM-DD"), end.format("YYYY-MM-DD"))
            _d.success(function(data) {
                if (data.error_code == 0) {
                    _draw_history(begin, end, data.number);
                }
            });
            _d.error(function(data) {
                console.error(data);
            });
        };

        $scope.draw_realtime_message_number = function($event) {
            _highlight($event);
            _get_realtime_number("message")
        };

        $scope.draw_realtime_customer_number = function($event) {
            _highlight($event);
            _get_realtime_number("customer")
        };

        $scope.draw_realtime_service_number = function($event) {
            _highlight($event);
            _get_realtime_number("service")
        };

        $scope.draw_history_message_number = function($event) {
            _highlight($event);
            _history_mode = "message";
            var begin = moment().subtract('days', 30);
            var end = moment();
            _select_history_date(begin, end, _history_mode);
        };

        $scope.draw_history_customer_number = function($event) {
            _highlight($event);
            _history_mode = "customer";
            var begin = moment().subtract('days', 30);
            var end = moment();
            _select_history_date(begin, end, _history_mode);
        };
        
        $scope.draw_history_service_number = function($event) {
            _highlight($event);
            _history_mode = "service";
            var begin = moment().subtract('days', 30);
            var end = moment();
            _select_history_date(begin, end, _history_mode);
        };
        
        // select the date you wanna view.
        $scope.selecteddate = function(begin, end) {
            _select_history_date(begin, end, _history_mode);
        };

        var _draw = function() {
            var begin = moment().subtract('days', 30);
            var end = moment();
            _select_history_date(begin, end, "customer");
            _draw_card();
            _get_realtime_number("customer");
        };

        var _translate = function() {
            var _tag_list = [];
            for (var i in yvTransTags.en.statistics.overview) {
                var _t = "statistics.overview." + i;
                _tag_list.push(_t);
            };
            $scope.translate = function() {
                // console.log($scope.lang);
            };
            yvUtil.translate($scope, 'lang', _tag_list, $scope.translate);
        };

        var _init = function() {
            _translate();
            $scope.refresh_settings_menu();
            yvLogin.prepare( function( errorCode ) {
                _draw();
            }, { $scope: $scope, onRefresh: _draw } );
        };

        _init();
});

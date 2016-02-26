angular.module("this_app")
    .directive("yvDataTable", function ($window, $state, $translate, $compile, $timeout, $rootScope) {

        function get_datatable_language(lang) {
            var datatable_langs = {
                'zh-CN': {
                    "sEmptyTable":     "表中没有数据",
                    "sInfo":           "显示 _START_ 到 _END_ ，共  _TOTAL_ 条",
                    "sInfoEmpty":      "显示 0 到 0 ，共 0 条",
                    "sInfoFiltered":   "(已筛选，共 _MAX_ 条)",
                    "sInfoPostFix":    "",
                    "sInfoThousands":  ",",
                    "sLengthMenu":     "显示 _MENU_ 条",
                    "lengthMenu":     "显示 _MENU_ 条",
                    "sLoadingRecords": "加载中...",
                    "sProcessing":     "处理中...",
                    "sSearch":         "搜索：",
                    "sZeroRecords":    "未找到匹配的记录",
                    "oPaginate": {
                        "sFirst":      "首页",
                        "sLast":       "末页",
                        "sNnext":       "后页",
                        "sPrevious":   "前页"
                    },
                    "oAria": {
                        "sSortAscending":  ": 升序",
                        "sSortDescending": ": 降序"
                    }
                },
                'en': {
                    "sEmptyTable":     "No data available in table",
                    "sInfo":           "Showing _START_ to _END_ of _TOTAL_ entries",
                    "sInfoEmpty":      "Showing 0 to 0 of 0 entries",
                    "sInfoFiltered":   "(filtered from _MAX_ total entries)",
                    "sInfoPostFix":    "",
                    "sInfoThousands":  ",",
                    "sLengthMenu":     "Show _MENU_ entries",
                    "lengthMenu":     "Show _MENU_ entries",
                    "sLoadingRecords": "Loading...",
                    "sProcessing":     "Processing...",
                    "sSearch":         "Search:",
                    "sZeroRecords":    "No matching records found",
                    "oPaginate": {
                        "sFirst":      "First",
                        "sLast":       "Last",
                        "sNext":       "Next",
                        "sPrevious":   "Previous"
                    },
                    "oAria": {
                        "sSortAscending":  ": activate to sort column ascending",
                        "sSortDescending": ": activate to sort column descending"
                    }
                }
            };

            if (lang != 'zh-CN')
                lang = 'en';

            return datatable_langs[lang];
        }; 

        return {
            restrict: 'A',
            scope: {
                dtOptions: '=',
                dtScope: "=",
                dtOnSelect: "&",
            },
            
            link: function ($scope, $element, $attrs) {
                // datatable user must set the ajax to get data

                if (!$scope.dtOptions || !$scope.dtOptions.ajax) {
                    console.log("DataTables consumer not set dtOptions");
                    return;
                };
                
                var language = get_datatable_language($translate.use());

    	        var options = {
                    createdRow: function(row, data, dataIndex) {
                        $compile(angular.element(row).contents())($scope);
                    },
                    
                    processing: true,
                    serching: true,
                    paging: true,
                    pageLength: 10,
                    language: language,
                    pagingType: "bootstrap_full_number",
                    lengthMenu: [5, 10, 25, 50, 75, 100],

                    dom: "<'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r>t<'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>",
                    
                };

                angular.extend(options, $scope.dtOptions);
                $scope.dtObject = $element.dataTable(options);
    
                $('select').select2({ minimumResultsForSearch: Infinity });

                var _onTranslate = function() {
                    if ($scope.dtObject) {
                        var language = get_datatable_language($translate.use());
                        var settings = $scope.dtObject.fnSettings();
                        $.extend(true, settings.oLanguage, language);

                        //console.debug($scope.dtObject.fnSettings());
                        //$scope.dtObject.fnDestroy(true);
                        //options.language = language;
                        //$scope.dtObject = $element.dataTable(options);
                        $scope.dtObject.fnDraw(true);
                        console.debug('on trans', $state);
                        //$state.reload($state.current.name);
                        /*
                        $timeout(function() {
                            //$state.go('.', {}, { reload: true });
                            $window.location.reload();
                            console.debug('1');
                        });
                        */
                        /*
                        $timeout(function () {
                            $state.go('.', {}, { reload: true });
                        }, 100);
                        */
                        //$scope.dtObject.api().draw();
                    }
                };
                $rootScope.$on('$translateChangeSuccess', _onTranslate);
            },

            
            controller: function($scope, $element, $attrs, $transclude, $timeout) {
            console.debug('xxxxxx');

                $scope.dtScope = $scope;
                $scope.dtSelected = [];

                if (!$scope.dtOptions || !$scope.dtOptions.ajax) {
                    console.log("DataTables consumer not set dtOptions");
                    return;
                };

                
                // clear the selected when redraw
                $scope.dtOptions.drawCallback = function() {
                    $timeout(function() {
                        $scope.dtSelected.length = 0;
                    });
                    var _c = $element.find('input[type="checkbox"]');
                    if (_c) {
                        _c.uniform();
                    }
                    //$('select').select2();
                };

                var _whatSelected = function() {
                    // console.log($scope.dtSelected);
                };
                
                // maybe checkbox
                $element.on('click', 'tbody > tr', function() {
                    if ($scope.dtOptions.noSelect) {
                        return;
                    }

                    if ($scope.dtOnSelect()) {
                        $scope.dtOnSelect()($(this).attr("id"));
                    }

                    var _c = $('input[type="checkbox"]', $(this));
                    
                    if($(this).hasClass("selected")) {
                        $(this).removeClass("selected");
                        if (_c) {
                            _c.attr("checked", false);
                        }
                        var _id = $(this).attr("id");
                        var _in = $.inArray(_id, $scope.dtSelected);
                        if (_in >= 0) {
                            $scope.dtSelected.splice(_in, 1);
                        }
                        
                    } else {
                        if ($scope.dtOptions.singleSelection) {
                            $('tbody > tr.selected', $($element)).removeClass("selected");
                            $scope.dtSelected.length = 0;
                        }
                        
                        $(this).addClass("selected");
                        if (_c) {
                            _c.attr("checked", true);
                        }
                        $scope.dtSelected.push($(this).attr("id"));
                    }

                    // set the group unchecked
                    if (_c) {
                        $('thead > tr > th input[type="checkbox"]', $element).attr("checked", false);
                        $element.find('input[type="checkbox"]').uniform();
                    }
                    
                    _whatSelected();
                });

                // if header then body
                $element.on('click', 'thead > tr > th input[type="checkbox"]', function() {
                    if ($scope.dtOptions.noSelect) {
                        return;
                    }
                    
                    var _v = $(this).is(":checked");
                    $('tbody > tr > td input[type="checkbox"]', $($element)).attr("checked", _v);
                    if (_v) {
                        
                        var _rs = $('tbody > tr', $element);
                        _rs.addClass("selected");
                        _rs.each(function(_i) {
                            $scope.dtSelected.push($(this).attr("id"));
                        });
                    } else {
                        $('tbody > tr', $($element)).removeClass("selected");
                        $scope.dtSelected.length = 0;
                    }
                    
                    $element.find('input[type="checkbox"]').uniform();
                    _whatSelected();
                });

            },
        };
    });

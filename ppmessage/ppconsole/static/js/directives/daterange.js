angular.module("this_app")
    .directive("dateRange", function($translate, $rootScope) {
        return {
            restrict: "A",

            scope: {
                onApply: "&",
                hasPredefinedRanges: "=",
                isSingle: "=",
            },

            link: function($scope, $element, $attrs) {
                var ontranslate=function(){
                    var trans_from_array=["calendar.TODAY_TAG","calendar.YESTERDAY_TAG","calendar.LAST_7_DAYS_TAG","calendar.LAST_30_DAYS_TAG","calendar.THIS_MONTH_TAG","calendar.LAST_MONTH_TAG","calendar.APPLY_LABEL_TAG","calendar.CANCEL_LABEL_TAG","calendar.FROM_LABEL_TAG","calendar.TO_LABEL_TAG","calendar.CUSTOM_RANGE_LABEL_TAG","calendar.monthname.JANUARY_TAG","calendar.monthname.FEBRUARY_TAG","calendar.monthname.MARCH_TAG","calendar.monthname.APRIL_TAG","calendar.monthname.MAY_TAG","calendar.monthname.JUNE_TAG","calendar.monthname.JULY_TAG","calendar.monthname.AUGUST_TAG","calendar.monthname.SEPTEMBER_TAG","calendar.monthname.OCTOBER_TAG","calendar.monthname.NOVEMBER_TAG","calendar.monthname.DECEMBER_TAG"];
                    $translate(trans_from_array).then(function (translation) {
                        var curr_language_name=$translate.use();
                        var trans_to_obj = translation;

                        var rangesObj = null;
                        if($scope.hasPredefinedRanges == true) {
                            rangesObj={};
                            rangesObj[trans_to_obj["calendar.TODAY_TAG"]]=[moment(), moment()];
                            rangesObj[trans_to_obj["calendar.YESTERDAY_TAG"]]=[moment().subtract('days', 1), moment().subtract('days', 1)];
                            rangesObj[trans_to_obj["calendar.LAST_7_DAYS_TAG"]]=[moment().subtract('days', 6), moment()];
                            rangesObj[trans_to_obj["calendar.LAST_30_DAYS_TAG"]]=[moment().subtract('days', 29), moment()];

                            rangesObj[trans_to_obj["calendar.THIS_MONTH_TAG"]]=[moment().startOf('month'), moment().endOf('month')];
                            rangesObj[trans_to_obj["calendar.LAST_MONTH_TAG"]]=[moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month')];
                        }

                        /*按钮文本定义*/
                        var localeObj={};
                        localeObj["applyLabel"]=trans_to_obj["calendar.APPLY_LABEL_TAG"];
                        localeObj["cancelLabel"]=trans_to_obj["calendar.CANCEL_LABEL_TAG"];
                        localeObj["fromLabel"]=trans_to_obj["calendar.FROM_LABEL_TAG"];
                        localeObj["toLabel"]=trans_to_obj["calendar.TO_LABEL_TAG"];
                        localeObj["customRangeLabel"]=trans_to_obj["calendar.CUSTOM_RANGE_LABEL_TAG"];
                        localeObj["daysOfWeek"]=['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
                        var monthNamesArray=[];
                        monthNamesArray[0]=trans_to_obj["calendar.monthname.JANUARY_TAG"];
                        monthNamesArray[1]=trans_to_obj["calendar.monthname.FEBRUARY_TAG"];
                        monthNamesArray[2]=trans_to_obj["calendar.monthname.MARCH_TAG"];
                        monthNamesArray[3]=trans_to_obj["calendar.monthname.APRIL_TAG"];
                        monthNamesArray[4]=trans_to_obj["calendar.monthname.MAY_TAG"];
                        monthNamesArray[5]=trans_to_obj["calendar.monthname.JUNE_TAG"];
                        monthNamesArray[6]=trans_to_obj["calendar.monthname.JULY_TAG"];
                        monthNamesArray[7]=trans_to_obj["calendar.monthname.AUGUST_TAG"];
                        monthNamesArray[8]=trans_to_obj["calendar.monthname.SEPTEMBER_TAG"];
                        monthNamesArray[9]=trans_to_obj["calendar.monthname.OCTOBER_TAG"];
                        monthNamesArray[10]=trans_to_obj["calendar.monthname.NOVEMBER_TAG"];
                        monthNamesArray[11]=trans_to_obj["calendar.monthname.DECEMBER_TAG"];
                        localeObj["monthNames"]=monthNamesArray;
                        localeObj["firstDay"]=1;

                        // $element.daterangepicker({
                        //     singleDatePicker: $scope.isSingle,
                        //     opens: 'left',
                        //     language: 'ru',
                        //     startDate: moment().subtract('days', 29),
                        //     endDate: moment(),
                        //     minDate: '01/01/2012',
                        //     maxDate: '12/31/2014',
                        //     dateLimit: {
                        //         days: 60
                        //     },
                        //     showDropdowns: false,
                        //     showWeekNumbers: true,
                        //     timePicker: false,
                        //     timePickerIncrement: 1,
                        //     timePicker12Hour: true,
                        //
                        //     ranges:rangesObj,
                        //
                        //     buttonClasses: ['btn btn-sm'],
                        //     applyClass: ' blue',
                        //     cancelClass: 'default',
                        //     format: 'MM/DD/YYYY',
                        //     separator: ' to ',
                        //     locale:localeObj,
                        // }, function (start, end) {
                        //     start.locale(curr_language_name);
                        //     end.locale(curr_language_name);
                        //     $element.find('span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
                        //     // $scope.onApply()(start, end);
                        //     $scope.onApply();
                        // });

                        $element.daterangepicker({
                            linkedCalendars: true,
                            opens: 'left',
                            minDays: 2,
                            maxDays: 30,
                            // start from 1-31 = 30
                            singleDatePicker: $scope.isSingle,
                            startDate: $scope.isSingle ? moment() :moment().subtract('days', 30),
                            endDate: moment(),
                            format: 'YYYY/MM/DD',
                            dateLimit: {
                                days: 30
                            },
                        }, function(start, end) {
                            start.locale(curr_language_name);
                            end.locale(curr_language_name);
                            $scope.onApply()(start, end);
                        });

                    });
                };
                $rootScope.$on('$translateChangeSuccess', ontranslate);
                ontranslate();
            },
        };
    })
;

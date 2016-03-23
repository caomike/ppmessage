angular.module("this_app")
    .directive("yvcolorpicker", ["$timeout", function($timeout) {
        return {
            restrict: "A",
            require: 'ngModel',
            
            link: function(scope, element, attrs, model) {

                element.ColorPickerSliders({
                    //size: "sm",
                    //previewontriggerelement: false,
                    placement: "right",
                    color: model.$modelValue,
                    previewformat: "hex",
                    swatches: true,
                    sliders: true,
                    hsvpanel: true,
                    onchange: function(container, color) {
                        scope.$apply(function() {
                            model.$setViewValue(color.tiny.toHexString());
                        });
                    },
                });
                
                model.$render = function() {
                    element.val(model.$modelValue);
                    element.change();                
                };
            },
            
        };
    }])
;


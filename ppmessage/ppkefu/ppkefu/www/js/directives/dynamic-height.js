ppmessageModule.directive("yvDynamicHeight", [function () {

    function _link($scope, $element, $attr) {
        /**
         * 文本框根据输入内容自适应高度
         * @param {HTMLElement}        输入框元素
         * @param {Number}             设置最大高度(可选)
         * @param {Number}             设置光标与输入框保持的距离(默认0)
         */
        function autoTextarea(elem, maxHeight, extra) {
            extra = extra || 0;

            function addEvent(type, callback) {
                elem.addEventListener(type, callback, false);
            }

            function getStyle(name) {
                return window.getComputedStyle(elem, null)[name];
            }

            var minHeight = parseFloat(getStyle('height'));

            elem.style.resize = 'none';

            function change() {
                var scrollTop,
                    height,
                    padding = 0,
                    style = elem.style;

                if (elem._length === elem.value.length) {
                    return;
                }

                elem._length = elem.value.length;
                padding = window.parseInt(getStyle('paddingTop')) + window.parseInt(getStyle('paddingBottom'));

                scrollTop = document.body.scrollTop || document.documentElement.scrollTop;

                elem.style.height = minHeight + 'px';

                if (elem.scrollHeight > minHeight) {
                    if (maxHeight && elem.scrollHeight > maxHeight) {
                        height = maxHeight - padding;
                        style.overflowY = 'auto';
                    } else {
                        height = elem.scrollHeight - padding;
                        style.overflowY = 'auto';
                    }

                    style.height = height + extra + 'px';
                    scrollTop += window.parseInt(style.height) - elem.currHeight;
                    document.body.scrollTop = scrollTop;
                    document.documentElement.scrollTop = scrollTop;
                    elem.currHeight = window.parseInt(style.height);
                }
            }

            addEvent('input', change);
        }

        autoTextarea($element[0], 80);
    }

    return {
        restrict: "C",
        link: _link
    };
}]);

/**
 * TODO: REFACTOR
 */
((function(View) {

    /**
     * @constructor
     */
    function Element(tag, attrs, ctrl) {
        var isObj = (attrs && typeof attrs === "object"),
            _id = (isObj) ? (attrs["id"]) : attrs,
            _e = _create(tag, attrs, isObj, _id),
            controller = ctrl;

        // bind controller to this
        this.controller = controller;

        function _create (tag, attrs, isObj, id) {
            var _attr = {};
            if (attrs) {
                if (isObj) {

                    $.each( attrs, function ( key, value ) {

                        if ( value !== undefined || value !== null ) {

                            switch ( key ) {
                            case 'className':
                                _attr [ 'class' ] = value;
                                break;

                            default:
                                _attr [ key ] = value;
                                break;
                            }
                            
                        }
                        
                    } );
                    
                    if (!_attr['class'] && _attr['id']) {
                        _attr['class'] = _attr['id'];
                    }
                } else {
                    if (id) {
                        _attr['id'] = id;
                        _attr['class'] = id;
                    }
                }
            }
            var e = document.createElement(tag);
            for (var key in _attr) {
                if (key != 'event' && key != 'selector') {
                    e.setAttribute(key, _attr[key]);
                }
            }
            if (_attr['event']) {

                var jQuerySelector = id ? '#' + id : _attr['selector'],
                    avaliableEvents = [
                        'click', 'mouseover', 'mouseleave', 'mousedown', 'keydown', 'keyup', 'change', 'input propertychange', 'focus', 'blur', 'init'
                    ];

                if (!jQuerySelector) throw new Error('No jQuerySelector');

                if (jQuerySelector) {

                    $.each(_attr['event'], function (key, value) {
                        if ($.inArray(key, avaliableEvents) != -1) {
                            
                            switch (key) {
                            case 'init':
                                setTimeout(function() {
                                    value.apply(this, arguments);
                                });
                                break;

                            case 'change':
                                setTimeout(function() {
                                    $(jQuerySelector).bind(key, function(e) {
                                        value.apply(this, $(this)); 
                                    });
                                });
                                break;

                            default:
                                setTimeout(function() {
                                    $(jQuerySelector).bind(key, function(e) {
                                        value.apply(this, arguments);
                                    });                              
                                });
                                break;
                            }
                        } 
                    });
                }
                
            }
            return $(e);
        }

        /**
         * 得到JQuery元素
         */
        this.getElement = function() {
            return _e;
        };

        this.getHTML = function() {
            return _e[0].outerHTML;
        };

        /**
         * 添加元素
         */
        this.add = function(e) {
            _e.append(e.getElement()[0].outerHTML);
            return this;
        };

        /**
         * 添加文字
         */
        this.text = function(str) {
            _e.text(str);
            return this;
        };

        /**
         * html...
         */
        this.html = function(htmlString) {
            _e.html(htmlString);
            return this;
        };

        /**
         * 显示或者隐藏该元素
         */
        this.show = function(show) {
            _e.css('display', show ? 'block' : 'none');
            return this;
        };

        /**
         * 设置 Controller
         */
        this.ctrl = function(ctrl) {
            controller = ctrl;
        }

        /**
         * 得到 Controller
         */
        this.getController = function() {
            return controller;
        };

        this.renderTo = function( $el ) {
        }
    }
    
    View.PPElement = Element;
    View.Element = Element;
    
})(View));

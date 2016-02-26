/**
 * 得到主色调，整体风格，颜色搭配等
 *
 * [Example]:
 *
 * var Style = View.Style.init(); // Don't forget to call `init` method before your first use
 * console.log( 'launcher color is: ', Style.Color.launcher_background_color );
 *
 */
View.Style = ( function() {

    var COLOR,

        api = {
            init: init
        };

    /////// API /////////////

    return api;

    //////// Internal ///////////
    
    function init() {
        api [ 'Color' ] = color();
        return api;
    }

    function color() {
        if ( COLOR !== undefined ) return COLOR;
        
        var mainColor =
            // Try get from `ppcom_launcher_color` first
            ( Service.$app.app() && Service.$app.app().ppcom_launcher_color ) || '#54C6D6',
            gray = '#fafafb',                
            darkerGray = '#E4E4E4';

        return {
            launcher_background_color: mainColor, //小泡背景颜色 /* #0074b0; */
            base: gray, //灰色
            base_darker: darkerGray, //深灰色

            hovercard_close_btn: 'rgba(40,45,50,.4)', // hovercard_close_button_background_color
        };
    }
    
} )();

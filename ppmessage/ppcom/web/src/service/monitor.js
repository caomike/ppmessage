Service.$monitor = ( function() {

    var Monitor = 'Monitor' + '/',
        Event = {
            show: Monitor + 'S',
            hide: Monitor + 'H',
            resume: Monitor + 'R',
            watch: Monitor + 'W',
            unwatch: Monitor + 'UW',
            typing: Monitor + 'T'
        };

    return {
        Event: Event,
        
        report: report,
        watch: watch
    }

    function report( event, data ) {
        Service.$pubsub.publish( event, data );
    }

    function watch( event, func ) {
        Service.$pubsub.subscribe( event, func );
    }

} )();

// DON'T write like this in other files
var __Monitor = Service.$monitor;
var __MonitorEvent = __Monitor.Event;

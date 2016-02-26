/**
 *
 * Service.$schedule.schedule(function() {
 *     // something you want do immediately
 * }, eventId ) // event Id
 * .after(function() {
 *     // something you want do after `3 * 1000` time
 * }, 3 * 1000 )
 * .onCancel(function() {
 *     // something you want do when you cancle this task
 * })
 * .start(); // DON'T forget to call `start` method to let it run
 *
 * Service.$schedule.cancelAll(); // cancel all schedule tasks
 *
 */
Service.$schedule = (function() {

    var DEFAULT_DELAY = 2 * 1000 , // 2 seconds
        DEFAULT_ONCE_DELAY = 2 * 1000, // 2 seconds

        scheduleArrays = [],

        onceEventArrays = [];

    return {
        
        schedule : function ( event, id ) {
            return new Schedule ( event, id );
        },

        cancelAll : function () {
            $.each ( scheduleArrays , function ( index, item ) {

                if ( !item.finished() ) {
                    item.cancel();
                }
                
            });
        },

        cancel : function ( id ) {
            
            var i = $.inArray ( id, scheduleArrays );
            
            if ( i !== -1 ) {
                id && $clearTimeout( scheduleArrays [ id ].timer );
                scheduleArrays [ id ] = undefined;
            }
            
        },

        once: function ( e, id, waitTime ) {
            Once ( e, id, waitTime );
        }
        
    }

    //////////////////////////
    
    function Schedule ( e, id ) {

        var event = e,
            eventId = id,
            afterEvent,
            cancelEvent,
            delay,
            cancel = false,
            finished = false;

        this.after = function ( e, d ) {
            afterEvent = e;
            delay = d || DEFAULT_DELAY;
            return this;
        };

        this.onCancel = function ( event ) {
            cancelEvent = event;
            return this;
        };

        this.cancel = function () {
            cancel = true;

            // Trigger cancel event
            if ( cancelEvent !== undefined ) {
                cancelEvent();
            }
        };

        this.finished = function () {
            return finished;
        }

        this.start = function () {

            if ( scheduleArrays [ eventId ] !== undefined ) {
                $clearTimeout( scheduleArrays [ eventId ].timer );
            }
            
            if ( $.isFunction ( event ) ) {
                event(); // do it
            }

            var timer = $.isFunction ( afterEvent ) &&

                $timeout ( function () {

                    // run after event
                    !cancel && afterEvent();

                    // we are finished
                    finished = true;
                    
                    scheduleArrays [ eventId ] = undefined;
                    
                }, delay );

            scheduleArrays [ eventId ] = {
                task: this,
                timer: timer
            };
            
        };
        
    }

    /////////////////////////
    function Once ( e, id, waitTime ) {

        var event = e,
            taskId = id,
            delay = waitTime || DEFAULT_ONCE_DELAY;

        if ( !$.isFunction ( e ) || !taskId ||
             // task exist
             onceEventArrays[ taskId ] !== undefined ) return;

        onceEventArrays[ taskId ] = {
            event: e
        },

        // trigger event
        e();

        $timeout( function () {

            // remove this event
            onceEventArrays[ taskId ] = undefined;
            
        }, delay );
    }
    
})();

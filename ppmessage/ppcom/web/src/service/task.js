Service.$task = ( function() {

    var todoList = [],
        repeatList = [],
        DEFAULT_TIME = 1000;

    return {
        plan: plan,
        cancel: cancel,

        repeat: repeat,
        cancelRepeat: cancelRepeat
    }

    function plan( id, event, time ) {
        todoList [ id ] = $timeout( event, time || DEFAULT_TIME );
    }

    function cancel( id ) {
        if ( todoList [ id ] ) {
            $clearTimeout( todoList [ id ].timer );
            todoList [ id ] = undefined;
        }
    }

    function repeat( id, event, time ) {
        repeatList [ id ] = setInterval( event, time || DEFAULT_TIME );
    }

    function cancelRepeat( id ) {
        if ( repeatList [ id ] ) {
            clearInterval( repeatList [ id ] );
            repeatList [ id ] = undefined;
        }
    }
    
} )();

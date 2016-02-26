//
// @description
//
// After presee the `play` button, you should listen the audio's state change event:
//
// Service.$pubsub.subscribe( 'audio/' + `your audio id`, function( topics, data ) {
//
//     var state = data.state,
//         audioId = data.audioId;
//
//     switch( state ) {
//         case Service.$audioContext.STATE.NULL:
//         1. `stop play`
//         2. Service.$pubsub.unsubscribe( 'audio/' + `your audio id` );
//         break;
//
//         case Service.$audioContext.STATE.ERROR:
//         1. `play error`
//         2. Service.$pubsub.unsubscribe( 'audio/' + `your audio id` );
//         break;
//
//         case Service.$audioContext.STATE.PLAYING:
//         `begin to play`
//         break;
//     }
//
// } );
//
Service.$audioContext = ( function() {

    var STATE = 
        {
            /* Initial state */
            NULL: 0,
            
            /* Audio is playing */
            PLAYING: 1,

            /* Audio miss source file or can not play */
            ERROR: 2
        },

        _audioObj, /* type: Service.PPMessage.Audio */
        _audio; /* type: window.Audio */

    return {
        STATE: STATE,
        isPlaying: isPlaying,
        
        play: safePlay,
        stop: safeStop,
        close: close
    }

    function isPlaying( audio ) {
        return _audioObj !== undefined && _audio !== undefined && _audioObj.id() === audio.id();
    }

    // @param audio
    //     Object `Service.PPMessage.Audio`
    //     @see `service/message/pp-message-audio.js`
    function safePlay( audio  ) {

        if ( _audioObj !== undefined && audio !== undefined ) {
            
            // the `audio` is playing ...    
            if ( _audioObj.id() === audio.id() ) {
                return;    
            }

            // another `audio` is playing ... stop it
            safeStop( _audioObj );
            
        }

        // Can not play
        if ( !audio.canPlay() || !Service.$device.audioMp3() ) {
            error( audio );
            return;
        }

        //
        // var foo = { a: 123 };
        // var bar = foo.a;
        // bar = undefined;
        // foo.a => `123`
        //
        // We only store the references of `audio` object here, not the `audio` object itself
        // So it's safe to execute ` _audioObj = undefined ` on the method `safeStop`, `audio` still keep the origin value
        //
        _audioObj = audio;
        _audio = new Audio( audio.src() );

        // An `audio` element can fire various `events`.
        // @see https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Media_events
        // @see http://www.runoob.com/jsref/dom-obj-event.html
        _audio.onended = function( e ) {
            safeStop( audio );
        };
        
        _audio.onerror = function( e ) {
            error( audio );
        };
        
        _audio.play();

        Service.$pubsub.publish( 'audio/' + _audioObj.id(), {
            state: STATE.PLAYING,
            audioId: _audioObj.id()
        } );
        
    }

    function safeStop( audio ) {
        if ( isPlaying( audio ) ) {

            _audio.currentTime = 0;
	        _audio.pause();

            Service.$pubsub.publish( 'audio/' + audio.id(), {
                state: STATE.NULL,
                audioId: audio.id()
            } );

            _audio = undefined;
            _audioObj = undefined;
        }
    }

    function error( audio ) {
        if ( isPlaying( audio ) ) {
            _audio = undefined;
            _audioObj = undefined;            
        }
        
        Service.$pubsub.publish( 'audio/' + audio.id(), {
            state: STATE.ERROR,
            audioId: audio.id()
        } );

    }

    function close() {
        safeStop( _audioObj );
    }
    
} )();

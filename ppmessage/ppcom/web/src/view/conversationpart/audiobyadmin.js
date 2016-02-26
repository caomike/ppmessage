View.$adminAudioMessage = ( function() {

    ////////////////
    /// View ////////
    ///////////////
    function AdminAudioMessageView( item ) {
        View.Div.call( this, { className: 'msg-audio-admin' } );

        var voiceImgBackground = 'url(' + Configuration.assets_path + 'img/icon-down.png) 0 -2427px',
            audio = item.message.audio,
            duration = audio.duration(),
            durationStr = duration + "''",
            audioBodySelector = getConversationAudioBodyHtmlSelector( item.messageId ),
            messageId = item.messageId,
            subscriber,
            
            onClick = function( e ) { // `client` event

                var audioId = audio.id(),
                    player = Service.$audioContext;
                
                if ( player.isPlaying( audio ) ) {
                    player.stop( audio );
                } else {
                    subscriber = Service.$pubsub.subscribe( 'audio/' + audioId, onAudioStateChange );

                    audio.markRead();
                    markRead( messageId );
                    
                    player.play( audio );
                }

                return true;
                
            };

        
        this.add( new View.Img( { src: item.user.avatar, className: 'pp-avatar' } ) )
            .add( new View.Div( { className: 'pp-content' } )
                  .add( new View.Span( { className: 'pp-name' } ).text( item.user.name ) )
                  .add( new View.Div( { className: 'pp-voice', uuid: audio.id() } )
                        .add( new View.Div( { className: 'pp-triangle' } ) )
                        .add( new View.Div( { className: 'pp-body',
                                              style: 'width:' + getVoiceViewLength( duration) + 'px',
                                              selector: audioBodySelector,
                                              event: {
                                                  click: onClick
                                              } } )
                              .add( new View.Element( 'i', { style: 'background:' + voiceImgBackground } ) ) )
                        .add( new View.Span( { className: 'pp-dura' } ).text( durationStr ) )
                        .add( new View.Div( { className: 'pp-unread' } ) ))
                  .add( new View.Span( { className: 'pp-desc' } ) ));

        // Initialize when `new`
        initialize(); 

        function initialize() {
            $timeout( function() {
                
                if ( !audio.canPlay() ) markError( messageId );

                if ( audio.hasRead() ) markRead( messageId );
                
            } );
        }

        function getVoiceViewLength( duration ) {
            var MIN = 45,
                MAX = 120,
                
                MAX_DURATION = 300,
                MIN_DURATION = 1;

            if ( duration > MAX_DURATION ) duration = MAX_DURATION;
            if ( duration < 0 ) duration = MIN_DURATION;
            
            return MIN + ( MAX - MIN ) * duration / MAX_DURATION;
        }

        function onAudioStateChange( topics, data ) {

            var STATE = Service.$audioContext.STATE,
                $pubsub = Service.$pubsub;

            switch ( data.state ) {
            case STATE.NULL:
                stopAudioAnimation( messageId, data.audioId );
                subscriber && $pubsub.unsubscribe( subscriber );
                subscriber = undefined;
                break;

            case STATE.ERROR:
                stopAudioAnimation( messageId, data.audioId );
                subscriber && $pubsub.unsubscribe( subscriber );
                subscriber = undefined;

                audio.markError();
                markError( messageId );
                break;

            case STATE.PLAYING:
                playAudioAnimation( messageId, data.audioId );
                break;
            }
            
        }
        
    }
    extend( AdminAudioMessageView, View.Div );

    ////// API /////////
    return {
        build: build,

        playAudioAnimation: playAudioAnimation,
        stopAudioAnimation: stopAudioAnimation
    }

    function build( message ) {
        return new AdminAudioMessageView( message );
    }

    function playAudioAnimation( messageId ) {

        var WIDTHS = [ 8.3, 13, 23 ],
            $el = findAudioView( messageId ),
            eventId = 'voice-' + messageId,
            index = 0;
        
        Service.$task.repeat( eventId, function() {
            $el.css( 'width', WIDTHS [ index++ % WIDTHS.length ] );
        }, 500 );
        
    }

    function stopAudioAnimation( messageId ) {
        Service.$task.cancelRepeat( 'voice-' + messageId );
        findAudioView( messageId ).css( 'width', 23 );
    }

    function markRead( messageId ) {
        $( getConversationHtmlSelector( messageId ) ).find( '.pp-unread' ).hide();
    }

    function clearError( messageId ) {
        findAudioDescView( messageId ).hide();
    }

    function markError( messageId ) {
        findAudioDescView( messageId )
            .css( 'color', 'red' )
            .text( Service.Constants.i18n( 'AUDIO_PLAY_ERROR' ) )
            .show();
    }

    function findAudioDescView( messageId ) {
        return $( getConversationHtmlSelector( messageId ) ).find( '.pp-desc' );
    }

    function findAudioView( messageId ) {
        return $( getConversationHtmlSelector( messageId ) )
            .find( '.pp-body' )
            .find( 'i' );
    }

    function getConversationHtmlSelector( messageId ) {
        return '#pp-conversation-part-' + messageId;
    }

    function getConversationAudioBodyHtmlSelector( messageId ) {
        return getConversationHtmlSelector( messageId ) + ' .pp-body';
    }
    
} )();

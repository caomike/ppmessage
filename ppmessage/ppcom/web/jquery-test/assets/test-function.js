function Test() {

    var debugArea = '#debug-area',
        dropDown = '.drop-down';

    return {
        onMessage: onMessage,
        onChattingMessage: onChattingMessage,
        onChattingTyping: onChattingTyping,
        sendMessage: sendMessage,
        conversationList: conversationList,
        userList: userList,
        userListInDropDown: userListInDropDown,
        monitor: monitorAll,

        clear: clear
    }

    /////// onNewMessageArrived ///////
    function monitorAll() {

        var $monitor = Service.$monitor,
            Event = $monitor.Event;
        
        $monitor.watch( Event.show, function( event, data ) {
            append( '[' + event + '] 会话 ' + data.uuid + ' 显示\n' );
        } );

        $monitor.watch( Event.hide, function( event, data ) {
            append( '[' + event + '] 会话 ' + data.uuid + ' 隐藏\n' );
        } );

        $monitor.watch( Event.resume, function( event, data ) {
            append( '[' + event + '] 会话 ' + data.uuid + ' onResume\n' );
        } );

        $monitor.watch( Event.watch, function( event, data ) {
            append( '[' + event + '] Watch Typing ' + data + '\n');
        } );

        $monitor.watch( Event.unwatch, function( event, data ) {
            append( '[' + event + '] UnWatch Typing ' + data + '\n');
        } );

        $monitor.watch( Event.typing, function( event, data ) {
            append( '[' + event + '] Typing ' + data + '\n');
        } );

    }
    
    function sendMessage() {

        var i = Math.floor( Math.random() * 2 );

        switch ( i ) {
        case 0:
            new Service.PPMessage.Builder('TEXT')
                .textMessageBody( getTextMessage().bo )
                .build().send();
            break;

        case 1:
            new Service.PPMessage.Builder('EMOJI')
                .emojiMessageCode( getEmojiMessage().bo )
                .build().send();
            break;
        }
        
    }
    
    function clear() {
        $( debugArea ).empty();
        $( dropDown ).find( 'option:first' ).attr( 'selected', true );
    }
    
    function debug( iterableObj ) {

        var content = '';
        $.each( iterableObj, function( index, item ) {

            // header
            content += index + '. ' + ( item.user_uuid || item.uuid ) + '\n\n';

            // body
            $.each( item, function( key, value ) {
                content += key + ': ' + value + '\n';
            } );

            // footer
            content += '====================\n\n';
            
        } );

        $( debugArea ).text( $( debugArea ).text() + content );
    }

    function append( text ) {
        var old = $( debugArea ).text();
        $( debugArea ).text( old + text );
        
        scroll();
    }

    function scroll() {
        $( debugArea ).stop().animate({
            scrollTop: $( debugArea )[0].scrollHeight
        }, 600, 'swing');
    }

    function userListInDropDown() {
        resetDropDown();
        
        var users = userList();
        $.each( users, function( index, item ) {
            $( dropDown ).append('<option uuid="' + item.user_uuid + '">' + item.user_fullname + '</option>');
        } );

        $( dropDown ).on( 'change' , function( e ) {
            var userId = $( this ).children( 'option:selected' ).attr( 'uuid' );
            if ( userId ) {
                
                var old = Service.$users.getUser( userId ).getInfo(),
                    newer = $.extend( { user_uuid: userId }, getRandomUserInfo() );

                Service.$users.updateUser( newer );
                append( '\n用户' + userId + '信息变更为：\n' );
                debug( [ newer ] );
                
            }
        } );
        
    }

    function resetDropDown() {
        $( dropDown ).empty().append('<option>None</option>');
        $( dropDown ).off( 'change' );
    }
    
    function userList() {
        var all = Service.$users.getUsers(),
            users = [];

        $.each( all, function( key, value ) {
            users.push( value.getInfo() );
        } );

        debug( users );
        return users;
    }
    
    function conversationList() {
        var all = Service.$conversationManager.all();
        debug( all );
    }
    
    function onChattingMessage() {
        onMessage( { chatting: true } );
    }

    function onChattingTyping() {
        var ci = Service.$conversationManager.activeConversation().uuid;
        Service.$notification.onWebSocketMessage( {
            data: {
                type: 'TYPING'
            }
        } );
    }
    
    function onMessage( config ) {

        var message = getRandomMessage();
        
        Service.$notification.onWebSocketMessage( {
            data: {
                type: 'MSG',
                msg: {
                    pid: Service.$tools.getUUID(),
                    id: Service.$tools.getUUID(),
                    ts: Date.now() / 1000,
                    ci: getConversationId(),
                    fi: getFi(),
                    tt: 'S2P',
                    ft: 'DU',
                    ms: message.ms,
                    bo: message.bo
                }
            }
        } );

        function getFi() {

            var all = Service.$users.getUsers(),
                ids = [];
            $.each( all, function( key, value ) {
                if ( key !== Service.$user.getUser().getInfo().user_uuid ) {
                    ids.push( key );    
                }
            } );

            return ids[ Math.floor( Math.random() * ids.length ) ];
            
        }

        function getConversationId() {

            if ( config && config.chatting ) {
                return Service.$conversationManager.activeConversation().uuid;
            }

            return randomConversationId();
            
            function randomConversationId() {

                var all = Service.$conversationManager.all(),
                    ciArrays = [];
                
                $.each( all, function( index, item ) {
                    if ( item.type == Service.$conversationManager.TYPE.CONVERSATION ) {
                        ciArrays.push( item.uuid );
                    }
                } );

                return ciArrays[ Math.floor( Math.random() * ciArrays.length ) ];
                
            }
            
        }
    }

    function getRandomMessage() {

        var messageTypeCount = 4,
            i = Math.floor( messageTypeCount * Math.random() );

        switch ( i ) {
        case 0:
            return getTextMessage();

        case 1:
            return getEmojiMessage();

        case 2:
            return getImageMessage();

        case 3:
            return getFileMessage();
        }
        
    }

    function getImageMessage() {

        var imgUrl = random( imgs() );
        
        return {
            ms: 'IMAGE',
            bo: Service.$json.stringify({
                orig: imgUrl
            })
        }
    }

    function getTextMessage() {
        var text = ['A', 'B', 'C', 'D', 'E', 'F', 'G',
                    'H', 'I', 'J', 'K', 'L', 'M', 'N',
                    'O', 'P', 'Q', 'R', 'S', 'T',
                    'U', 'V', 'W', 'X', 'Y', 'Z' ][ Math.floor( Math.random() * 26 ) ];
        return {
            ms: 'TEXT',
            bo: text
        }
    }

    function getEmojiMessage() {
        var emojiArray = Service.$emoji.getEmojiGroup( [
            'People', 'Nature', 'Objects',
            'Places', 'Symbols'
        ][ Math.floor( Math.random() * 5 ) ] );

        var keys = [];
        $.each( emojiArray, function( key, value ) {
            keys.push( key );
        } );

        var emoji = emojiArray[ keys [ Math.floor( Math.random() * keys.length ) ] ].value;

        return {
            ms: 'TEXT',
            bo: emoji
        };
    }

    function getFileMessage() {
        
        var name = random( [ '文件-1', '文件-2', 'File-3' ] ),
            fid = Service.$tools.getUUID();

        return {
            ms: 'FILE',
            bo: Service.$json.stringify( {
                name: name,
                fid: fid
            } )
        }
        
    }

    function getRandomUserInfo() {
        return {
            user_fullname: [ '小明', '小红', '小芳' ][ Math.floor( Math.random() * 3 ) ],
            user_avatar: imgs() [ Math.floor( Math.random() * imgs().length ) ],
            is_online: [ true, false ][ Math.floor( Math.random() * 2 ) ]
        }
    }

    function random( array ) {
        return array [ Math.floor( Math.random() * array.length ) ];
    }

    function imgs() {
        return [
            'http://e.hiphotos.baidu.com/image/h%3D300/sign=f33b35d67a1ed21b66c928e59d6fddae/b21bb051f819861842d54ba04ded2e738bd4e600.jpg',
            'http://img2.imgtn.bdimg.com/it/u=3947386643,2401800583&fm=23&gp=0.jpg',
            'http://img3.imgtn.bdimg.com/it/u=3084720760,288869075&fm=23&gp=0.jpg',
            'http://img4.imgtn.bdimg.com/it/u=52754568,3369504778&fm=23&gp=0.jpg',
            'http://img0.imgtn.bdimg.com/it/u=2845747024,3167693364&fm=23&gp=0.jpg',
            'http://img4.imgtn.bdimg.com/it/u=2584355946,4148531126&fm=23&gp=0.jpg',
            'http://img2.imgtn.bdimg.com/it/u=2160420705,2533030665&fm=23&gp=0.jpg',
            'http://img1.imgtn.bdimg.com/it/u=421165063,3498236940&fm=23&gp=0.jpg',
            'http://img5.imgtn.bdimg.com/it/u=209761400,1951974759&fm=23&gp=0.jpg',
            'http://img4.imgtn.bdimg.com/it/u=2293915270,526489152&fm=11&gp=0.jpg',
            'http://img0.imgtn.bdimg.com/it/u=2531583001,1422407153&fm=23&gp=0.jpg',
            'http://img1.imgtn.bdimg.com/it/u=2093058865,1325752770&fm=23&gp=0.jpg',
            'http://img5.imgtn.bdimg.com/it/u=632680172,595028883&fm=23&gp=0.jpg',
            'http://img2.imgtn.bdimg.com/it/u=1724304029,2011548657&fm=23&gp=0.jpg',
            'http://img1.imgtn.bdimg.com/it/u=642819720,2965626235&fm=11&gp=0.jpg',
            'http://img1.imgtn.bdimg.com/it/u=266880594,205135855&fm=23&gp=0.jpg',
            'http://img4.imgtn.bdimg.com/it/u=693354233,2652180815&fm=11&gp=0.jpg',
            'http://img4.imgtn.bdimg.com/it/u=2684396043,3390854681&fm=23&gp=0.jpg',
            'http://img0.imgtn.bdimg.com/it/u=3676558158,1680314104&fm=23&gp=0.jpg',
            'http://img3.imgtn.bdimg.com/it/u=2969725826,2642695997&fm=23&gp=0.jpg',
            'http://img1.imgtn.bdimg.com/it/u=690802292,3622175025&fm=23&gp=0.jpg',
            'http://img3.imgtn.bdimg.com/it/u=49812969,110034636&fm=23&gp=0.jpg',
            'http://img4.imgtn.bdimg.com/it/u=1718720747,2799425769&fm=23&gp=0.jpg',
            'http://img4.imgtn.bdimg.com/it/u=3402125124,3537687320&fm=23&gp=0.jpg',
            'http://img3.imgtn.bdimg.com/it/u=259588212,3088751835&fm=23&gp=0.jpg',
            'http://img0.imgtn.bdimg.com/it/u=1251795695,445939417&fm=23&gp=0.jpg',
            'http://img2.imgtn.bdimg.com/it/u=1745088913,794630035&fm=23&gp=0.jpg',
            'http://img3.imgtn.bdimg.com/it/u=1250904486,3831896269&fm=23&gp=0.jpg',
            'http://img3.imgtn.bdimg.com/it/u=4131486482,3650592575&fm=23&gp=0.jpg',
            'http://img1.imgtn.bdimg.com/it/u=1668320013,469116154&fm=23&gp=0.jpg',
            'http://img0.imgtn.bdimg.com/it/u=1444843527,1432845993&fm=23&gp=0.jpg',
            'http://img2.imgtn.bdimg.com/it/u=985788794,2632812390&fm=23&gp=0.jpg',
            'http://img3.imgtn.bdimg.com/it/u=3042226720,3865293507&fm=23&gp=0.jpg',
            'http://img4.imgtn.bdimg.com/it/u=2926920398,3757699980&fm=23&gp=0.jpg',
            'http://img1.imgtn.bdimg.com/it/u=2828341053,849876388&fm=23&gp=0.jpg',
            'http://img3.imgtn.bdimg.com/it/u=2693076931,3434605236&fm=23&gp=0.jpg',
            'http://img1.imgtn.bdimg.com/it/u=3977873970,616557059&fm=23&gp=0.jpg'
        ];
    }
    
}

var test = Test();

function showGroupMembers() {
    View.$sheetHeader.showDropDownButton();
    Controller.$groupMembers.show();
}

function changeGroupMemberHovercardPseudoPosition( right ) {
    
    var str = window.getComputedStyle(document.querySelector('.pp-container .group-member-hovercard'), ':before') 
        .getPropertyValue('right');

    Service.$debug.h().d( ':before', str );

    $('<style>.pp-container .group-member-hovercard:after,.pp-container .group-member-hovercard:before{right:' +
      right + 
      'px}</style>').appendTo('.pp-container .group-member-hovercard');
    
}

function getScrollBarWidth () {
    var inner = document.createElement('p');
    inner.style.width = "100%";
    inner.style.height = "200px";

    var outer = document.createElement('div');
    outer.style.position = "absolute";
    outer.style.top = "0px";
    outer.style.left = "0px";
    outer.style.visibility = "hidden";
    outer.style.width = "200px";
    outer.style.height = "150px";
    outer.style.overflow = "hidden";
    outer.appendChild (inner);

    document.body.appendChild (outer);
    var w1 = inner.offsetWidth;
    outer.style.overflow = 'scroll';
    var w2 = inner.offsetWidth;
    if (w1 == w2) w2 = outer.clientWidth;

    document.body.removeChild (outer);

    return (w1 - w2);
};

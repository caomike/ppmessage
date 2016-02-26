( function() {

    var $,
        Service,
        Modal;

    ////////// PPDebug ////////////
    window.PPDebug = ( function() {

        var debugContainer = 'pp-debug',
            debugContainerId = '#' + debugContainer;

        return {
            show: show,
            hide: hide
        }

        function show() {
            if ( !window.PP ) throw new Error( 'window.PP is undefined' );

            $ = PP.fn.$;
            Service = PP.fn.Service;
            Modal = PP.fn.Modal;
            
            if ( $( debugContainerId ).is( ':visible') ) return;

            _buildView();
        }

        function hide() {
            $( debugContainerId ).detach();
        }

        function _buildView() {
            $( document.body ).append( '<div id=' + debugContainer + '></div>' );
            _cssDebugContainer();

            var $elDebugContainer = $( debugContainerId );
            
            $elDebugContainer.append( _buildInputViewHtml( 'random-msg-arrived', '随机新消息到来' ) );
            $elDebugContainer.append( _buildInputViewHtml( 'current-msg-arrived', '当前会话新消息到来' ) );
            $elDebugContainer.append( _buildInputViewHtml( 'show-all-conversations', '显示所有会话列表' ) );
            $elDebugContainer.append( _buildInputViewHtml( 'show-all-users', '显示所有用户' ) );
            $elDebugContainer.append( _buildInputViewHtml( 'typing', '当前会话对方正在输入' ) );
            $elDebugContainer.append( _buildInputViewHtml( 'send-msg', '当前会话发送消息' ) );
            $elDebugContainer.append( _buildInputViewHtml( 'monitor', '监视所有事件' ) );
            $elDebugContainer.append( _buildInputViewHtml( 'user-info-change', '加载所有用户信息至下拉菜单' ) );
            $elDebugContainer.append( _buildInputViewHtml( 'audio-msg-arrived', '当前会话语音消息到来' ) );
            $elDebugContainer.append( _buildInputViewHtml( 'text-msg-arrived', '当前会话文字消息到来' ) );
            $elDebugContainer.append( _buildInputViewHtml( 'file-msg-arrived', '当前会话文件消息到来' ) );
            $elDebugContainer.append( _buildInputViewHtml( 'img-msg-arrived', '当前会话图片消息到来' ) );
            $elDebugContainer.append( _buildInputViewHtml( 'emoji-msg-arrived', '当前会话Emoji消息到来' ) );
            $elDebugContainer.append( _buildInputViewHtml( 'get-current-conversation-uuid', '得到当前会话conversation_uuid' ) );
            $elDebugContainer.append( _buildInputViewHtml( 'console-current-conversation-msgs', 'console打印当前会话所有消息' ) );
            $elDebugContainer.append( _buildInputViewHtml( 'simulate-and-show-group-members-with-diverse-state', '显示组下拉用户(假数据+状态随机)' ) );
            $elDebugContainer.append( _buildInputViewHtml( 'add-duplicate-ppcom-script', '在已有的情况下添加一个新的scripts' ) );
            
            $elDebugContainer.append( '<br/><select class="drop-down"><option>None</option></select><br/>' );
            $elDebugContainer.append( _buildInputViewHtml( 'clear', '清空' ) );
            $elDebugContainer.append( '<textarea id="debug-area"></textarea>' );
            _cssDebugTextarea();

            var test = Test();
            window.PPTest = test;
            _bindViewClickEvent( 'random-msg-arrived', test.onMessage );
            _bindViewClickEvent( 'current-msg-arrived', test.onChattingMessage );
            _bindViewClickEvent( 'show-all-conversations', test.conversationList );
            _bindViewClickEvent( 'show-all-users', test.userList );
            _bindViewClickEvent( 'typing', test.onChattingTyping );
            _bindViewClickEvent( 'send-msg', test.sendMessage );
            _bindViewClickEvent( 'monitor', test.monitor );
            _bindViewClickEvent( 'user-info-change', test.userListInDropDown );
            _bindViewClickEvent( 'clear', test.clear );
            _bindViewClickEvent( 'audio-msg-arrived', test.onAudioMessage );
            _bindViewClickEvent( 'text-msg-arrived', test.onTextMessage );
            _bindViewClickEvent( 'file-msg-arrived', test.onFileMessage );
            _bindViewClickEvent( 'img-msg-arrived', test.onImgMessage );
            _bindViewClickEvent( 'emoji-msg-arrived', test.onEmojiMessage );
            _bindViewClickEvent( 'get-current-conversation-uuid', test.debugCurrentConversationId );
            _bindViewClickEvent( 'console-current-conversation-msgs', test.consoleCurrentConversationMsgs );
            _bindViewClickEvent( 'simulate-and-show-group-members-with-diverse-state', test.simulateAndShowGroupMembersWithDiverseState );
            _bindViewClickEvent( 'add-duplicate-ppcom-script', test.addDuplicatePPComScripts );
            
        }

        function _cssDebugContainer() {
            $( debugContainerId ).css( {
                'z-index': 12345678,
                position: 'absolute',
                top: 20,
                left: 20,
                padding: 5,
                border: '1px solid black',
                background: 'rgba(0, 0, 0, 0.38)'
            } );
        }

        function _cssDebugTextarea() {
            $( '#debug-area' ).css( {
                color: 'white',
                width: 600,
                height: 300,
                left: 200,
                'background-color': 'rgba(0, 0, 0, 0.17)'
            } );
        }

        function _buildInputViewHtml( cls, val ) {
            return '<input type="button" value="' + val + '" class="' + cls + '" /><br/>'
        }

        function _bindViewClickEvent( cls, func ) {
            $( debugContainerId + ' .' + cls ).on( 'click', func );
        }
        
    } )();

    ///////// Test //////////
    function Test() {

        var debugArea = '#debug-area',
            dropDown = '.drop-down';

        return {
            onMessage: onMessage,
            onChattingMessage: onChattingMessage,
            onAudioMessage: onAudioMessage,
            onTextMessage: onTextMessage,
            onFileMessage: onFileMessage,
            onImgMessage: onImgMessage,
            onEmojiMessage: onEmojiMessage,
            
            onChattingTyping: onChattingTyping,
            sendMessage: sendMessage,
            conversationList: conversationList,
            userList: userList,
            userListInDropDown: userListInDropDown,
            monitor: monitorAll,

            debugCurrentConversationId: debugCurrentConversationId,
            consoleCurrentConversationMsgs: consoleCurrentConversationMsgs,

            simulateAndShowGroupMembersWithDiverseState: simulateAndShowGroupMembersWithDiverseState,
            addDuplicatePPComScripts: addDuplicatePPComScripts,

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

        function debugCurrentConversationId() {
            append(
                '当前活跃会话 conversation_uuid: ' + 
                Service.$conversationManager.activeConversation().uuid );
        }

        function consoleCurrentConversationMsgs() {
            Service.$debug.h().d(
                Modal.$conversationContentGroup
                    .get( Service.$conversationManager.activeConversation().uuid )
                    .getMessages()
            );
        }

        function addDuplicatePPComScripts() {
            var head = document.getElementsByTagName('head')[0];
            var ppcom = document.createElement("script");
            ppcom.setAttribute('src', 'http://192.168.0.206:8080/ppcom/assets/pp-library.min.js');
            head.appendChild(ppcom);
        }

        function simulateAndShowGroupMembersWithDiverseState() {

            var users = Service.$users.getUsers(),
                fakeUsers = [];
                
            $.each( users, function( key, value ) {

                if ( Service.$user.quickId() !== key ) { // ignore current portal user

                    // random online state
                    var user = $.extend( {}, value.getInfo() );
                    user.is_browser_online = random( [ true, false ] );
                    user.is_mobile_online = random( [ true, false ] );
                    user.is_online = user.is_browser_online || user.is_mobile_online;
                    fakeUsers.push( user );
                    
                }
                
            } );

            debug( fakeUsers );
            
            View.$groupMembers._show( fakeUsers );
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
            _onMessage( getRandomMessage(), config );
        }

        function onAudioMessage() {
            _onMessage( getAudioMessage(), { chatting: true } );
        }

        function onTextMessage() {
            _onMessage( getTextMessage(), { chatting: true } );
        }

        function onFileMessage() {
            _onMessage( getFileMessage(), { chatting: true } );
        }

        function onImgMessage() {
            _onMessage( getImageMessage(), { chatting: true } );
        }

        function onEmojiMessage() {
            _onMessage( getEmojiMessage(), { chatting: true } );
        }

        function _onMessage( message, config ) {
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

            var messageTypeCount = 5,
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

            case 4:
                return getAudioMessage();
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
            var texts = ['A', 'B', 'C', 'D', 'E', 'F', 'G',
                         "A shout out to developers of SourceTree - a nice GUI for git and hg. Useful even for a command-line fan like me. ",
                         "In a keypress event, the Unicode value of the key pressed is stored in either the keyCode or charCode property, never both. If the key pressed generates a character (e.g. 'a'), charCode is set to the code of that character, respecting the letter case. (i.e. charCode takes into account whether the shift key is held down). Otherwise, the code of the pressed key is stored in keyCode.",
                         "This feature is non-standard and is not on a standards track. Do not use it on production sites facing the Web: it will not work for every user. There may also be large incompatibilities between implementations and the behavior may change in the future."
                        ],
                text = texts [ Math.floor( Math.random() * texts.length ) ];
            
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

        function getAudioMessage() {
            
            var mp3 = [ { fid: 'http://192.168.0.212:8001/assets/congcong_wangfei.mp3',
                           dura: 241
                         },
                         { fid: 'http://192.168.0.212:8001/assets/congcong_wangfei_10.mp3',
                           dura: 6
                         },
                         { fid: 'http://192.168.0.212:8001/assets/zhiqingchun_wangfei.mp3',
                           dura: 193
                         } ] [ Math.floor( Math.random() * 3 ) ];

            return {
                ms: 'AUDIO',
                bo: Service.$json.stringify( {
                    mp3: mp3               
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
    
} )();

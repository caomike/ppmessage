angular.module("this_app")
    .controller("StatisticsHistoryMessageCtrl", function($scope, $state, $timeout, $translate, $stateParams, yvAjax, yvUser, yvConstants, yvLog, yvUtil, yvTransTags, yvLogin) {

        var DEFAULT_PAGE_SIZE = 10, // default show 10 conversation in each page
            MAX_PAGE_RANGE = 5, // << [5][6][7][8][9] >> max show 5 groups

            pageSize = DEFAULT_PAGE_SIZE, 
            
            conversationList = [], // all conversations

            _logined = function() { // On logined callback
                yvLogin.prepare( function( errorCode ) {
                    asyncGetAppConversationList(onGetAppConversationListSuccessCallback, onGetAppConversationListErrorCallback);
                }, { $scope: $scope, onRefresh: function() {
                    asyncGetAppConversationList(onGetAppConversationListSuccessCallback, onGetAppConversationListErrorCallback);
                } } );
            },

            _translate = function() { // TRANSLATE IT
                var _tag_list = [];
                for (var i in yvTransTags.en.statistics.historymessages) {
                    var _t = "statistics.historymessages." + i;
                    _tag_list.push(_t);
                };

                $scope.translate = function() {};
                yvUtil.translate($scope, 'lang', _tag_list, $scope.translate);
            },
            
            sortConversationList = function(conversationList) { // sort conversations by time
                
                var getConversationTimestamp = function (conversation) {
                    var time = (conversation.latest_message && conversation.latest_message.updatetime) ||
                        conversation.updatetime;
                    
                    return yvUtil.dateUtil.moment(time);
                };

                // sort
                conversationList && conversationList.sort(function(conversationA, conversationB) {
                    
                    var timestampA = getConversationTimestamp(conversationA),
                        timestampB = getConversationTimestamp(conversationB);

                    return timestampA >= timestampB ? 1 : -1;
                    
                });
            },

            asyncGetAppConversationList = function(successCB, errorCB) { // request server to get app_conversation_list
                // get service user all conversations                
                yvAjax.get_app_conversation_list({
                    app_uuid: yvUser.get_team().uuid
                }).success(function(response) {
                    // handle empty case

                    var conversationArray = [];
                    
                    // refresh data and update dom
                    response.list && $.each(response.list, function(index, item) {

                        // Ignore 'S2S' conversation_type, only show 'P2S' type
                        var ignore = item.conversation_type == 'S2S';

                        if (!ignore) {
                            var conversation = {
                                user_uuid : item.create_user && item.create_user.uuid,
                                user_name : item.create_user && item.create_user.user_fullname,
                                user_image : item.create_user && yvUtil.iconUtil.getIcon(item.create_user.user_icon),

                                news_abbr : yvUtil.messageUtil.getMessageSummary($scope.lang,

                                                                                 item.latest_message &&
                                                                                 item.latest_message.message_subtype,
                                                                                 
                                                                                 item.latest_message &&
                                                                                 item.latest_message.body),
                                news_count : item.message_total_count,
                                news_date : yvUtil.messageUtil.getMessageFormatedDate(item.latest_message),
                                
                                con_uuid: item.uuid,
                            };

                            // append to array
                            conversationArray.push(conversation);
                        }

                    });

                    // sort app conversation list
                    sortConversationList(conversationArray);
                    
                    // success callback
                    if (successCB) successCB(conversationArray);
                }).error(function(error) {
                    // error callback
                    if (errorCB) errorCB(error);
                });                
            },

            onGetAppConversationListSuccessCallback = function(appConversationList) { // get conversation list success callback

                conversationList = appConversationList; // cache data 
                
                var length = conversationList.length;
                
                // refresh page dom
                create_page(length);

                // toggle page to page 1
                if (length > 0) {
                    $scope.toggle_page($scope.pages[0]);
                }
            },

            onGetHistoryMessagesSuccessCallback = function(response, user_uuid) { // on get history message success callback

                var tmp = response.data;
                var news = tmp.list;
                
                $scope.messages = [];      
                news.forEach(function(val) {
                    $scope.messages.unshift(trans_type(val, user_uuid));
                });
            },

            onRequestDataError = function(error) {
                $scope.set_flash_style("flash flash-error");
                $scope.set_update_string(error);                
            },

            onGetAppConversationListErrorCallback = function(error) { // get conversation list error callback
                onRequestDataError($scope.lang['statistics.historymessages.MESSAGE_GET_ERROR_TAG']);
            },

            onGetHistoryMessageErrorCallback = function(error) { // get single conversation messages error callback
                onRequestDataError($scope.lang['statistics.historymessages.MESSAGE_GET_ERROR_TAG']);
            },

            create_page = function(count) { // create page dom

                var groupsCount = parseInt(count / pageSize),
                    fixGroupsCount = (groupsCount * pageSize != count) ? groupsCount + 1 : groupsCount;
                
                $scope.total_pages = fixGroupsCount;
                
                if($scope.total_pages > 1) {
                    if($scope.total_pages > MAX_PAGE_RANGE) {
                        for(var i = 1; i <= MAX_PAGE_RANGE; i++) {
                            var tmp = {};
                            tmp.page_num = i;
                            tmp.is_active = false;
                            $scope.pages.push(tmp);
                        }
                    } else {
                        for(var i = 1; i <= $scope.total_pages; i++) {
                            var tmp = {};
                            tmp.page_num = i;
                            tmp.is_active = false;
                            $scope.pages.push(tmp);
                        }
                    }
                    // $scope.pages[0].is_active = true;
                } else {
                    $scope.pages.push({
                        page_num: 1,
                        is_active: false
                    });
                }
            },

            // get the message direction. if fi is equal to ui, it is dir_in.
            getMessageDirection = function(from_uuid, user_uuid) {                
                if(from_uuid == user_uuid) {
                    return 'DIR_IN';
                }
                return 'DIR_OUT';
            },

            // when date selected, show the conversations under the date.
            showConversationsWithSelectedDate = function(targetDate) {

                var _ans_conversationList = [];

                conversationList.forEach(function(val){
                    var _conversationDate = val.news_date;
                    if(_conversationDate.split()[0] == targetDate) {
                        _ans_conversationList.push(val);
                    }
                });


                $timeout(function() {
                    $scope.news_list = _ans_conversationList;
                });                

            },
        
            //get matched conversation with target messages.
            getMatchedConversation = function(target) {
                return [];
            },

            trans_type = function(src, user_uuid) {         // trans to the proper type to show in the preview window

                var _user_icon = null;
                if(src.from_type == "AP"){
                    _user_icon = yvUtil.iconUtil.getIcon();
                }else {
                    _user_icon = yvUtil.iconUtil.getIcon(src.from_user.user_icon);
                };
                var messageJsonBody = JSON.parse(src.message_body);
                
                var previewMessage = {
                    conversation_uuid: messageJsonBody.ci,
                    from_uuid: messageJsonBody.fi,
                    message_direction: getMessageDirection(src.from_uuid, user_uuid),
                    message_duration: null,
                    message_file: null,
                    message_id: messageJsonBody.id,
                    message_mime: null,
                    message_name: null,
                    message_size: null,
                    message_body: src.body,
                    message_status: 'RECV_NEW',
                    message_subtype: messageJsonBody.ms,
                    message_thumbnail: null,
                    message_timestamp: messageJsonBody.ts,
                    show_profile: false,
                    show_timestamp: true,
                    task_uuid: null,
                    to_uuid: messageJsonBody.ti,
                    to_type: messageJsonBody.tt,
                    message_type: 'NOTI',
                    conversation_type: src.conversation_type,
                    from_user: src.from_user,
                    user_icon: _user_icon,
                };

                return previewMessage;
            };
        
        // this used to be a container of messages for a certain news.
        $scope.messages = [];

        // get the news list of current page.
        $scope.news_list = [];

        // current page num.
        $scope.cur_page = -1;

        // each page of pagination will be an item.
        $scope.pages = [];

        // return the conversation with search.
        $scope.search_conversations = function() {
            if($scope.search_target == "") return;
            var _ans = getMatchedConversation($scope.search_target);
            $scope.search_target = "";
            if(_ans.length == 0) {
                alert('没有任何匹配的结果');
                return;
            }

            $timeout(function() {
                $scope.news_list = _ans;
            });
        };

        // return the conversations with selected date.
        $scope.select_date = function(begin, end) {
            var _target_date = begin.format('YYYY-MM-DD');
            showConversationsWithSelectedDate(_target_date);
        };

        // show the preview window.
        $scope.show_pre_window = function(item) {
            var con_uuid = item.con_uuid;
            var user_uuid = item.user_uuid;

            yvAjax.get_history_messages({
                'conversation_uuid': con_uuid,
                'page_offset': -1                    
            }).then(function(response) {
                onGetHistoryMessagesSuccessCallback(response, user_uuid);
            }, //success
                    onGetHistoryMessageErrorCallback); //error
        };

        // toggle to the clicked page.
        $scope.toggle_page = function(item) {
            
            // if is cur_page, return.
            if (item.page_num == $scope.cur_page) {
                return;
            }

            // get current page's data
            var curPageConversationsArray = conversationList.slice((item.page_num - 1) * pageSize,
                                                                   item.page_num * pageSize);
            $scope.news_list = curPageConversationsArray;

            // active current page's class
            $scope.pages.forEach(function(val) {
                val.is_active = false;
            });
            item.is_active = true;
            $scope.cur_page = item.page_num;

        };

        // get pre pages of the pagination.
        $scope.pre_pages = function() {
            var st_page = $scope.pages[0]['page_num'];
            if(st_page != 1) {
                var num = 0;
                if(st_page >= MAX_PAGE_RANGE) {
                    num = MAX_PAGE_RANGE;
                } else {
                    num = st_page - 1;
                }

                for(var i = 1; i <= num; i++) {
                    var tmp = {};
                    tmp.page_num = st_page - i;
                    tmp.is_active = false;
                    //insert to pre pages.
                    $scope.pages.unshift(tmp);
                }

                // slice with first MAX_PAGE_RANGE.
                $scope.pages = $scope.pages.slice(0, MAX_PAGE_RANGE);

                // toggle to the last page.
                $scope.toggle_page($scope.pages[$scope.pages.length-1]);
            }
        };

        // get back pages of the pagination.
        $scope.back_pages = function() {
            var end_page = $scope.pages[$scope.pages.length-1]['page_num'];
            if(end_page != $scope.total_pages) {
                var num = 0;
                var len = $scope.total_pages - end_page;
                if(len >= MAX_PAGE_RANGE) {
                    num = MAX_PAGE_RANGE;
                } else {
                    num = len;
                }

                $scope.pages = [];
                for (var i = 1; i <= num; i++) {
                    var tmp = {};
                    tmp.page_num = end_page + i;
                    tmp.is_active = false;
                    // $scope.pages.shift();
                    $scope.pages.push(tmp);
                }
                // toggle to the first page.
                $scope.toggle_page($scope.pages[0]);
            }
        };
        
        var _init = function() {
            $scope.refresh_settings_menu();
            _translate();
            _logined();
        };

        _init();


    });

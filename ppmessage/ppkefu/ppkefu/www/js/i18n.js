ppmessageModule.config([
    "$translateProvider",
    "yvTransTags",
    function ($translateProvider, yvTransTags) {
        $translateProvider.useSanitizeValueStrategy('escape');
        $translateProvider.translations("en", yvTransTags.en);
        $translateProvider.translations("zh-CN", yvTransTags.cn);
        $translateProvider.registerAvailableLanguageKeys(["en", "zh-CN"], {
            "en": "en",
            "en-US": "en",
            "en-UK": "en",
            "zh-CN": "zh-CN",
            "zh_CN": "zh-CN",
            "zh-cn": "zh-CN",
            "zh-Hans": "zh-CN"
        });
        $translateProvider.fallbackLanguage("en", "zh-CN");
    }

]).constant("yvTransTags", {

    en: {
        noapp: {
            LOGIN_TAG: "Log In",
            USERNAME_TAG: "Username",
            USEREMAIL_TAG: "User email",
            PASSWORD_TAG: "Password",
            LOGIN_CANCEL_TAG: "Cancel",
            
            serverList: {
                SERVER_LIST: "Servers"
            },

            addServer: {
                ADD_SERVER_TAG: "Add Server",
                SERVER_NAME: "Name",
                SERVER_PROTOCOL: "Protocol",
                SERVER_HOST: "Host",
                SERVER_PORT: "Port",
                SERVER_NAME_NOTE: "Any name",
                SERVER_PROTOCOL_NOTE: "http:// or https://",
                SERVER_HOST_NOTE: "192.168.0.1, ppmessage.cn",
                SERVER_PORT_NOTE: "80, 8080",   
                USE_HTTPS_PROTOCOL: "Use https protocol",
                SET_DEFAULT_SERVER_TAG: "Set as default server"
            },

            loginWithUser: {
                LOGIN_TAG: "Log In",
                LOGIN_PASSWORD_TAG: "Password",
                SWITCH_USER_TAG: "Switch User"
            },

            switchServer: {
                DELETE_SERVER_TAG: "Delete"
            },

            register: {
                REGISTER: "Register",
                REGISTER_BY_MOBILE: "Register by phone number",

                INPUT_VERIFY_CODE: "Verification Code",
                INPUT_MOBILE: "Phone Number",
                INPUT_USER_EMAIL: "Email Account",
                INPUT_USER_NAME: "Display Name",
                INPUT_USER_PWD: "Password",
                INPUT_USER_PWD_CONFIRM: "Confirm Password",

                BUTTON_GET_VERIFY_CODE: "Get Verification Code",

                ALERT_ILLEGAL_EMAIL: "Invalid email",
                ALERT_ILLEGAL_CONFIRM_PWD: "Passwords do not match",
                ALERT_ILLEGAL_PASSWORD_LENGTH: "Password is too long",
                ALERT_ILLEGAL_CONTAINS_SPACE: "Password must not contain space",
                ALERT_ILLEGAL_VERIFY_CODE: "Error verification code",
                ALERT_ILLEGAL_PHONE_NUMBER: "Invalid phone number",

                ALERT_REGISTER_SUCCESSFUL: "Registered successful",
                ALERT_REGISTER_FAILED: "Registered failed",
                ALERT_REGISTER_FAILED_EMAIL_EXISTED: "Registered failed: This email has already been registered.",
                ALERT_REGISTER_FAILED_MOBILE_EXISTED: "Registered failed: This phone number has already been registered."
            }
        },

        app: {
            common: {
                SAVE_TAG: "Save",
                RESTORE_TAG: "Restore",
                CANCEL_TAG: "Cancel",
                OK_TAG: "OK",
                BACK_TAG: "Back"
            },
            settings: {
                SETTINGS_TAG: "Settings",
                LOG_OUT_TAG: "Log Out",
                APPLICATION_TAG: "App",
                profile_photo: {
                    LOADING_TAG: "Loading image...",
                    PROFILE_PHOTO_TAG: "Profile Photo",
                    TAKE_PHOTO_TAG: "Take Photo",
                    CHOOSE_FROM_PHOTOS_TAG: "Choose from Photos"
                },
                name: {
                    NAME_TAG: "Name",
                    INPUT_NEW_NAME_TAG: "Please input your new name"
                },
                signature: {
                    SIGNATURE_TAG: "Signature",
                    WRITE_SOMETHING: "Write something"
                },
                password: {
                    PASSWORD_TAG: "Password",
                    INPUT_ORIGIN_PASSWORD_TAG: "Input your original password",
                    INPUT_NEW_PASSWORD_TAG: "Input your new password",
                    INPUT_NEW_PASSWORD_AGAIN_TAG: "Input your new password again"
                },
                push_noti: {
                    PUSH_NOTIFICATION_TAG: "Notifications"
                },
                language: {
                    LANGUAGE_TAG: "Language",
                    CHINESE_TAG: "中文",
                    ENGLISH_TAG: "English"
                },
                app: {
                    APP_TAG: "App"
                },
                about: {
                    ABOUT_TAG: "About",
                    CANT_GET_NEWEST_VERSION_TAG: "Can't get application version",
                    IS_NEWEST_VERSION_TAG: "Already at latest version",
                    UPGRADE_TO_VERSION_TAG: "Upgrade to version "

                },
                integrate: {
                    INTEGRATE_TAG: "Application Integration"
                }
            },
            messages: {
                MESSAGE_TAG: "Messages",
                CONVERSATIONS_TAG: "Conversations",
                MARK_AS_READ_TAG: "Mark as read",
                DELETE: "Delete",
                ALL: "All",
                UNASSIGNED: "Unassigned",
                MINE: "Mine"
            },
            contact: {
                CONTACT_TAG: "Contacts",
                SERVICE_TAG: "Services",
                SEARCH_TAG: "Search",
                ORGANIZATION_TAG: "Organizations",
                DISCUSSION_TAG: "Discussions",
                NEW_FRIENDS_TAG: "New Friends",
                SERVANT: "Servants",
                CUSTOMER: "Customer"
            },
            newFriends: {
                MESSAGE_TAG: "New Friends",
                NO_NEW_INVITATIONS: "Empty invitations",
                RECEIVE_INVITE_TAG: "Agree",
                ADDED_TAG: "Approved",
                DELETE_TAG: "Delete",

                REQUEST_JOIN_OG: "I want to join organization: ",
                APPROVE_JOIN_OG_FAILED: "Can not agree, please try again later"
            },
            organization: {
                ORGANIZATION_TAG: "Organizations",
                SEARCH_HINT_TAG: "Search"
            },
            discussion: {
                DISCUSSION_TAG: "Discussions",
                SEARCH_HINT_TAG: "Search"
            },
            makeDiscussion: {
                MAKE_DISCUSSION_TAG: "Create Discussion",
                ADD_DISCUSSION_MEMBER_TAG: "Add Member",
                SEARCH_HINT_TAG: "Search contacts by keywords",
                OK: "OK",

                ADD_DG_TITLE: "Please fill in the discussion group's name"
            },

            addFriends: {
                ADD_NEW_FRIENDS: "Add Friends",
                SEARCH_HINT_TAG: "Search friends by keywords"
            },

            service: {
                SERVICE_TAG: "Services",
                SEARCH_HINT_TAG: "Search"
            },
            followService: {
                FOLLOW_SERVICE_TAG: "Subscribe services",
                SEARCH_HINT_TAG: "Search"
            },
            detailInfo: {
                DETAIL_INFO_TAG: "Details",
                FULLNAME_TAG: "Display Name",
                LOGIN_NAME_TAG: "Login Name",
                PROFILE_PHOTO_TAG: "Profile Photo",
                TYPE_TAG: "Type: ",
                MAIL_TAG: "Email",
                IDENTITY_TAG: "Identity",
                BELONG_TO_ORG_TAG: "Superordinate Organizations",
                MESSAGE_HISTORY_TAG: "Message History",
                CHAT_WITH_USER_TAG: "Chat",
                DELETE_USER_TAG: "Remove Contact",
                INVITE_USER_AS_CONTACT_TAG: "Invite as Contact",

                USER_EMAIL: "Email",
                USER_IDENTITY: "Identity",
                USER_EDUCATION: "Education",
                USER_CALENDAR: "School Calendar",
                USER_DEPARTMENT: "Department",
                USER_MAJOR: "Major",
                USER_CLASS: "Class",

                INVITE_CONTACT: "I want to invite you to be my contact."
            },
            orgInfo: {
                DETAIL_INFO_TAG: "Details",
                DESCRIPTION_TAG: "Descriptions",
                PROFILE_PHOTO_TAG: "Profile Photo",
                FULLNAME_TAG: "Group Name",
                TYPE_TAG: "Type: ",
                SUB_ORG_TAG: "Subordinate Organization",
                MAKE_DISCUSSION_TAG: "Make Discussion",
                ORG_MEMBERS_TAG: "Organization Members",

                REQUEST_JOIN_OG: "Join",
                REQUEST_JOIN_OG_COMPLETED: "Send join request successful",
                REQUEST_JOIN_OG_FAILED: "Send join request failed"
            },

            discussionInfo: {
                DESC: "Descriptions",
                TYPE: "Type: ",
                MESSAGE_HISTORY: "Message History",
                QUIT_DISCUSSION: "Quit",
                DELETE_DISCUSSION: "Delete",
                PERSION: "people",
                DG_FULLNAME: "Dicussion Name",
                DG_PROFILE_PHOTO: "Profile Photo"
            },

            serviceInfo: {
                DESC: "Descriptions",
                TYPE: "Type: ",
                FULLNAME: "Service Name",
                PROFILE_PHOTO: "Profile Photo",
                MESSAGE_HISTORY: "Message History",
                UNFOLLOW: "UnSubscribe",
                FOLLOW: "Subscribe"
            },

            leftPanel: {
                MESSAGE_TAG: "Messages",
                CONTACTS_TAG: "Contacts",
                SETTINGS_TAG: "Settings"
            },

            messageThread: {
                PULL_TO_LOAD_MORE: "Load More",
                LOGIN_PASSWORD_TAG: "Password",
                OK_TAG: "OK",
                CANCEL_TAG: "Cancel",
                CHOOSE_CONTACTS_TAG: "Choose Contacts",
                SEARCH_CONTACTS_TAG: "Search contacts by keywords",

                SEND: "Send",
                SEND_TIP: "Press Ctrl+Enter to start a new line",
                TEXTAREA_TIP: "Write something...",

                ASSIGN: "Assign",
                TYPE: "Type",
                SERVICE_USER: "Service User",
                PORTAL_USER: "Portal User",
                TOGGLE_FONT_SIZE: "Toggle font size: "
            },

            lockPopover: {
                COPY_TAG: "Copy",
                ENCRYPTOIN_TAG: "Encryption",
                DECRYPTION_TAG: "Decryption",
                DELETE_TAG: "Delete"
            },

            myContacts: {
                SEARCH_HINT_TAG: "Search"
            },

            messageHistory: {
                PULL_TO_LOAD_MORE: "Load More"
            },

            slackIntegrate: {
                TITLE: "Slack",
                SEND_TAG: "Send"
            },

            evernoteIntegrate: {
                BOOK_TITLE: "Evernote Book",
                NOTE_TITLE: "Evernote Note",
                SEND_TAG: "Send",

                DOWNLOAD_FAILED: "Download Failed"
            },

            gpsLocation: {
                LOCATION_TITLE: "Location",

                SEND: "Send",
                POS_SERVICE_NOT_OPEN: "Position service did not open.",
                DETAIL: "Detail Information",
                SOLUTION_TO_NOT_OPEN_POS_SERVICE: "You can try the following method to enable location services: ",

                SOLUTION_ON_DEVICE: "In the equipment",
                SOLUTION_SETTING: "Settings",
                SOLUTION_PRIVACY: "Privacy",
                SOLUTION_LOCATING_SERVICE: "Locating service",
                SOLUTION_ENABLE: "enable locating service, add allows in the following application list",
                SOLUTION_USE: "to use locating service."

            },

            forgetPassword: {
                REGISTER_EMAIL: "Registered email address",
                RESET_PASSWORD: "Reset password"
            },

            chatModal: {
                CHOOSE: "Select",
                CANCEL: "Cancel"
            },

            LOCAL: {

                SAVE_TO_PHONE: "Save to the phone",

                SAVE: "Save",

                CHECK_UPDATE: "Updated to",
                IS_UPDATED: "It's been the latest version",
                GET_VERSION_FAIL: "Could not get the latest version",

                PROMPT_LEAVE: "Are you sure you want to leave?"

            },

            COMMON: {
                ERR_TITLE: "Error",
                INFO_TITLE: "Prompt",
                SET_SUCCESS: "Setting successfully",
                SET_FAILURE: "Setting failed"
            },

            changeiconctrl: {
                SMALL_ICON: "The picture size should not be less than 160 * 160 pixels!"
            },

            changefullnamectrl: {
                FULLNAME_EMPTY: "The name can't be empty",
                FULLNAME_TOO_LARGE: "No more than 32 characters"
            },

            changepwdctrl: {
                PROMPT_EMPTY: "Both the original password and new password can not be empty",
                PROMPT_PWD_ERROR: "Incorrect original password",
                PROMPT_VERIFY_ERROR: "The second input password is different from the first one.",
                PROMPT_SAME_ERROR: "The new password can't be the same as the original password.",
                PROMPT_LENGTH: "No more than 16 characters"
            },

            conversationsctrl: {
                NO_MESSAGE: "There is no messages, slide to the right to view the main menu."
            },

            GLOBAL: {
                ERR_TOKEN: "Can't get access token",
                ERR_NET: "Can't connect to server",
                ERR_LOGIN: "Can't login",
                ERR_USERPASS: "Username or password incorrect",
                ERR_IOSTOKEN: "Failed to get message push identity.",
                ERR_NO_SERVER: "No server is selected !",
                ERR_NO_PASSWORD_EMAIL: "No password and email",
                ERR_NO_ENOUGH_INFO: "Miss parameter to action.",

                ONLINE: "OnLine",
                OFFLINE: "Offline",
                
                NO_AVAILABLE_CONTACT: "No available contacts",
                NO_AVAILABLE_GROUP: "No available groups",
                NO_AVAILABLE_SERVANT: "No available service users for this group",
                
                CANT_GET_MORE_HISTORY_MESSAGES: "Can't get more history messages",
                CANT_GET_MORE_CONVERSATIONS: "Can't get more conversations",
                CANT_REFRESH_CONVERSATIONS: "Can't refresh conversations",
                
                TITLE_FILE:        "File Message",
                TITLE_AUDIO:       "Audio Message",
                TITLE_TEXT:        "Text Message",
                TITLE_TXT:         "Text Message",
                TITLE_IMAGE:       "Image Message",
                TITLE_SINGLE_CARD:   "Card Message",
                TITLE_MULTIPLE_CARD: "Card Message",
                TITLE_GPS_LOCATION:  "Location Message",
                TITLE_ACCEPT_CONTACT: "Accepted Invite Message",
                TITLE_DG_INVITED:     "Joined Discussion Group Message",
                TITLE_DESKTOP:        "Receive new message",
                TITLE_REQUEST_JOIN_OG: "Request Message",
                TITLE_APPROVE_JOIN_OG: "Approve Message",
                TITLE_LOGOUT:          "Logout Message",
                TITLE_UNKNOWN:            "Unknown Message",

                CANT_OPEN_FILE: "Can't open this file",
                
                SHOW_BADGE: "Show Badge",
                SHOW_BADGE_NOTE: "When message arrives, show unread count in App icon",
                MUTE_NOTIFICATION: "Mute Notification",
                MUTE_NOTIFICATION_NOTE: "No notification when message arrives",
                SILENCE_NOTIFICATION: "Silence Notification",
                SILENCE_NOTIFICATION_NOTE: "Only show text notification, no sound alert when new message arrives ",
                MUTE_OTHER_MOBILE_DEVICE: "Mute Notificaiton in Mobile",
                MUTE_OTHER_MOBILE_DEVICE_NOTE: "When login in both Web and mobile device, let mobile device not show notification",
                IS_DISTRIBUTOR_USER: "Set as Distributor",
                IS_DISTRIBUTOR_USER_NOTE: "A distributor can receive messages from any portal user and assign conversations to other service user",
                
                //notification-body
                BODY_REQUEST_JOIN_OG: "request to join organization",
                BODY_APPROVE_JOIN_OG: "Approve to join organization",

                //messagebody
                BODY_CHAT_MESSAGE_REQUEST_JOIN_OG: "I want to join organization: ",

                TIMESTAMP_LANGUAGE: "en",
                TIMESTAMP_FORMAT: "MM-DD HH:mm",

                MESSAGE_DG_INVITED: "I invite you joined the discussion",
                MESSAGE_ACCEPT_CONTACT: "I accepted your invitation, and we are friends now.",
                MESSAGE_INVITE_CONTACT: "I want to make friends with you.",
                MESSAGE_APPROVE_JOIN_OG: "I approved you to join organization:",

                ALERT_OK: "Ok",
                ALERT_CANCEL: "Cancel",
                CLOSE: "Close",
                SAVE: "Save",
                SAVE_PHOTO_SUCCESS: "Successfully save image to albumn",
                SAVE_PHOTO_FAILURE: "Fail to save image to albumn",
                DOWNLOAD_FAILURE: "Request to download fails",

                RECORD_CANCEL: "Slip on your fingers, cancel the send",
                RECORD_RELEASE: "Release your fingers, cancel the send",
                CANCEL_REC_TIP: "Slip on your fingers, cancel the send.",

                LOGIN_IN_ANOTHER_DEVICE: "Your account has logined in another device",

                FILE: "Files",
                PICTURE: "Pictures",
                CAMERA: "Camera",
                LOCATION: "Location",
                SLACK: "Slack",
                EVERNOTE: "Evernote",
                MESSAGE_CONTENT: "Message Content",
                
                ASSIGN_TO: "Conversation is assigned to: ",

                CANCEL: "Cancel",
                COPY: "Copy",
                FORWARD: "Forward",
                DELETE: "Delete",
                LOCK: "Lock",
                UNLOCK: "UnLock",

                RELOAD: "Reload",

                SEARCH: "Search",
                YESTERDAY: "Yesterday",
                
                UPDATE_TITLE: "A new version is avaliable!",
                UPDATE_CONTENT1: "Current version is ",
                UPDATE_CONTENT2: ", do you want to upgrade to the latest version",
                UPDATE_CONTENT3: " ?",

                UPDATE_FAILED: "Update failed",
                UPDATE_SUCCESS: "Update successfully",
                
                NO_RECENT_MESSAGE: "No recent message",
                NO_MORE_HISTORY_MESSAGES: "No more history messages",
                
                CHECKING_FILE: "Checking file ...",
                UPLOADING_FILE: "Uploading file ...",
                SENDING: "Sending Message ...",
                CANCELED: "Canceled",                
                TYPING: " is typing ",

                CONVERSATIONS: "Conversations",
                CONTACTS: " Contacts",
                NO_RESULTS: "No results",
                SELECT_APP: "Select a app",
                PRECEED: "Preceed",
                QUIT: "Quit",
                REMEMBER_MY_CHOICE: "Remember my choice",
                NO_CONVERSATION_SELECTED: "No conversation selected",
                NO_CONTACT_SELECTED: "No contact selected",
                NO_SETTING_SELECTED: "No setting item selected",
                NO_CONVERSATION: "No conversation",
                NO_CONTACT: "No contact",
                YOU_DONT_HAVE_ANY_APP: "You don't have any app",
                ON_BEFORE_UNLOAD_WARNING: "You will log out if window is closed.",
                NO_MATCH_RESULTS: "No match results",

                ADD_MEMBER: "Add Member",
                ADD_BY_CONTACT: "Add by Contact",
                ADD_BY_GROUP: "Add by Group",
            }
        }
    },

    cn: {
        noapp: {
            LOGIN_TAG: "登录",
            USERNAME_TAG: "用户名",
            USEREMAIL_TAG: "邮箱",
            PASSWORD_TAG: "密码",
            LOGIN_CANCEL_TAG: "取消",
            
            serverList: {
                SERVER_LIST: "服务器列表"
            },

            addServer: {
                ADD_SERVER_TAG: "添加服务器",
                SERVER_NAME: "名称",
                SERVER_PROTOCOL: "协议",
                SERVER_HOST: "主机",
                SERVER_PORT: "端口",
                SERVER_NAME_NOTE: "任意名称",
                SERVER_PROTOCOL_NOTE: "http:// 或 https://",
                SERVER_HOST_NOTE: "192.168.0.1，ppmessage.cn",
                SERVER_PORT_NOTE: "80，8080",
                USE_HTTPS_PROTOCOL: "使用 https 协议",
                SET_DEFAULT_SERVER_TAG: "设为默认服务器"
            },

            loginWithUser: {
                LOGIN_TAG: "登录",
                LOGIN_PASSWORD_TAG: "密码",
                SWITCH_USER_TAG: "切换账号"
            },

            switchServer: {
                DELETE_SERVER_TAG: "删除"
            },

            register: {
                REGISTER: "注册",
                REGISTER_BY_MOBILE: "手机号码注册",

                INPUT_VERIFY_CODE: "手机验证码",
                INPUT_MOBILE: "手机号",
                INPUT_USER_EMAIL: "邮箱",
                INPUT_USER_NAME: "用户姓名",
                INPUT_USER_PWD: "密码",
                INPUT_USER_PWD_CONFIRM: "密码确认",

                BUTTON_GET_VERIFY_CODE: "获取手机验证码",

                ALERT_ILLEGAL_EMAIL: "邮箱格式错误",
                ALERT_ILLEGAL_CONFIRM_PWD: "密码不一致",
                ALERT_ILLEGAL_PASSWORD_LENGTH: "密码不能大于16个字符",
                ALERT_ILLEGAL_CONTAINS_SPACE: "密码不能包含空格",
                ALERT_ILLEGAL_VERIFY_CODE: "验证码错误",
                ALERT_ILLEGAL_PHONE_NUMBER: "手机格式不正确",

                ALERT_REGISTER_SUCCESSFUL: "注册成功",
                ALERT_REGISTER_FAILED: "注册失败",
                ALERT_REGISTER_FAILED_EMAIL_EXISTED: "注册失败：该邮箱已被注册过",
                ALERT_REGISTER_FAILED_MOBILE_EXISTED: "注册失败：该手机号已被注册过"
            }
        },
        app: {
            common: {
                SAVE_TAG: "保存",
                RESTORE_TAG: "撤销",
                CANCEL_TAG: "取消",
                OK_TAG: "确定",
                BACK_TAG: "返回"
            },
            settings: {
                SETTINGS_TAG: "设置",
                LOG_OUT_TAG: "退出登录",
                APPLICATION_TAG: "应用",
                profile_photo: {
                    LOADING_TAG: "图片加载中...",
                    PROFILE_PHOTO_TAG: "头像",
                    TAKE_PHOTO_TAG: "拍照",
                    CHOOSE_FROM_PHOTOS_TAG: "选择图片"
                },
                name: {
                    NAME_TAG: "姓名",
                    INPUT_NEW_NAME_TAG: "请输入新姓名"
                },
                signature: {
                    SIGNATURE_TAG: "签名",
                    WRITE_SOMETHING: "写点什么吧"
                },
                password: {
                    PASSWORD_TAG: "密码",
                    INPUT_ORIGIN_PASSWORD_TAG: "请输入原密码",
                    INPUT_NEW_PASSWORD_TAG: "请输入新密码",
                    INPUT_NEW_PASSWORD_AGAIN_TAG: "请再输入一次新密码"
                },
                push_noti: {
                    PUSH_NOTIFICATION_TAG: "通知"
                },
                language: {
                    LANGUAGE_TAG: "语言",
                    CHINESE_TAG: "中文",
                    ENGLISH_TAG: "English"
                },
                app: {
                    APP_TAG: "应用"
                },
                about: {
                    ABOUT_TAG: "关于",
                    CANT_GET_NEWEST_VERSION_TAG: "无法获取版本信息",
                    IS_NEWEST_VERSION_TAG: "已是最新版本",
                    UPGRADE_TO_VERSION_TAG: "更新至版本 "


                },
                integrate: {
                    INTEGRATE_TAG: "应用集成"
                }
            },
            messages: {
                MESSAGE_TAG: "消息",
                CONVERSATIONS_TAG: "对话",
                MARK_AS_READ_TAG: "已读",
                DELETE: "删除",
                ALL: "所有",
                UNASSIGNED: "未分配",
                MINE: "我的"
            },
            contact: {
                CONTACT_TAG: "通讯录",
                SERVICE_TAG: "服务",
                SEARCH_TAG: "搜索",
                ORGANIZATION_TAG: "组织",
                DISCUSSION_TAG: "群聊",
                NEW_FRIENDS_TAG: "新的朋友",
                SERVANT: "客服",
                CUSTOMER: "客户"
            },
            newFriends: {
                MESSAGE_TAG: "新的朋友",
                NO_NEW_INVITATIONS: "没有新的联系人邀请",
                RECEIVE_INVITE_TAG: "接受",
                ADDED_TAG: "已同意",
                DELETE_TAG: "删除",

                REQUEST_JOIN_OG: "我想要请求加入组织：",
                APPROVE_JOIN_OG_FAILED: "同意失败，请稍后重试"
            },
            organization: {
                ORGANIZATION_TAG: "组织",
                SEARCH_HINT_TAG: "搜索"
            },
            discussion: {
                DISCUSSION_TAG: "群聊",
                SEARCH_HINT_TAG: "搜索"
            },
            makeDiscussion: {
                MAKE_DISCUSSION_TAG: "添加群聊",
                ADD_DISCUSSION_MEMBER_TAG: "添加成员",
                SEARCH_HINT_TAG: "输入关键词搜索联系人",
                OK: "确定",

                ADD_DG_TITLE: "填写群聊名"
            },
            addFriends: {
                ADD_NEW_FRIENDS: "添加联系人",
                SEARCH_HINT_TAG: "输入关键词搜索联系人"
            },
            service: {
                SERVICE_TAG: "服务",
                SEARCH_HINT_TAG: "搜索"
            },
            followService: {
                FOLLOW_SERVICE_TAG: "添加服务",
                SEARCH_HINT_TAG: "搜索"
            },
            detailInfo: {
                DETAIL_INFO_TAG: "详细信息",
                FULLNAME_TAG: "名称",
                LOGIN_NAME_TAG: "登录名",
                PROFILE_PHOTO_TAG: "头像",
                TYPE_TAG: "类型: ",
                MAIL_TAG: "邮箱",
                IDENTITY_TAG: "身份",
                BELONG_TO_ORG_TAG: "所属组织",
                MESSAGE_HISTORY_TAG: "消息历史",
                CHAT_WITH_USER_TAG: "对话",
                DELETE_USER_TAG: "删除联系人",
                INVITE_USER_AS_CONTACT_TAG: "邀请为联系人",

                USER_EMAIL: "邮箱",
                USER_IDENTITY: "身份",
                USER_EDUCATION: "学历",
                USER_CALENDAR: "学年制",
                USER_DEPARTMENT: "院系",
                USER_MAJOR: "专业",
                USER_CLASS: "班级",

                INVITE_CONTACT: "我想要加你为好友."
            },
            orgInfo: {
                DETAIL_INFO_TAG: "详细信息",
                DESCRIPTION_TAG: "组织描述",
                PROFILE_PHOTO_TAG: "组织头像",
                FULLNAME_TAG: "组织名称",
                TYPE_TAG: "类型: ",
                SUB_ORG_TAG: "下级组织",
                MAKE_DISCUSSION_TAG: "建立群聊",
                ORG_MEMBERS_TAG: "组织成员",

                REQUEST_JOIN_OG: "请求加入组织",
                REQUEST_JOIN_OG_COMPLETED: "已发送请求加入组织消息",
                REQUEST_JOIN_OG_FAILED: "发送请求加入消息失败"
            },

            discussionInfo: {
                DESC: "描述",
                TYPE: "类型：",
                MESSAGE_HISTORY: "消息历史",
                QUIT_DISCUSSION: "退出该群",
                DELETE_DISCUSSION: "删除该群",
                PERSION: "人",
                DG_FULLNAME: "群聊名称",
                DG_PROFILE_PHOTO: "群聊头像"
            },

            serviceInfo: {
                DESC: "描述",
                TYPE: "类型: ",
                PROFILE_PHOTO: "服务头像",
                FULLNAME: "服务名称",
                MESSAGE_HISTORY: "消息历史",
                UNFOLLOW: "取消关注",
                FOLLOW: "关注"
            },

            leftPanel: {
                MESSAGE_TAG: "消息",
                CONTACTS_TAG: "通讯录",
                SETTINGS_TAG: "设置"
            },

            messageThread: {
                PULL_TO_LOAD_MORE: "更多",
                LOGIN_PASSWORD_TAG: "登录密码",
                OK_TAG: "确定",
                CANCEL_TAG: "取消",
                CHOOSE_CONTACTS_TAG: "选择联系人",
                SEARCH_CONTACTS_TAG: "根据关键词搜索联系人",

                SEND: "发送",
                SEND_TIP: "按Ctrl+Enter换行",
                TEXTAREA_TIP: "写点什么吧...",

                FILE: "文件",
                PICTURE: "图片",
                CAMERA: "拍照",
                LOCATION: "位置",
                SLACK: "Slack",
                EVERNOTE: "印象笔记",
                MESSAGE_CONTENT: "消息内容",

                ASSIGN: "分配",
                TYPE: "类型",
                SERVICE_USER: "客服",
                PORTAL_USER: "客户",
                TOGGLE_FONT_SIZE: "改变字体大小: "
            },

            lockPopover: {
                COPY_TAG: "复制",
                ENCRYPTOIN_TAG: "加密",
                DECRYPTION_TAG: "解密",
                DELETE_TAG: "删除"
            },

            myContacts: {
                SEARCH_HINT_TAG: "搜索"
            },

            messageHistory: {
                PULL_TO_LOAD_MORE: "更多"
            },

            slackIntegrate: {
                TITLE: "Slack",
                SEND_TAG: "发送"
            },

            evernoteIntegrate: {
                BOOK_TITLE: "Evernote 笔记本",
                NOTE_TITLE: "Evernote 笔记",
                SEND_TAG: "发送",

                DOWNLOAD_FAILED: "下载失败"
            },

            gpsLocation: {
                LOCATION_TITLE: "位置",

                SEND: "发送",
                POS_SERVICE_NOT_OPEN: "定位服务没有开启",
                DETAIL: "查看详情",
                SOLUTION_TO_NOT_OPEN_POS_SERVICE: "可以尝试以下方法启用位置服务：",

                SOLUTION_ON_DEVICE: "在设备的",
                SOLUTION_SETTING: "设置",
                SOLUTION_PRIVACY: "隐私",
                SOLUTION_LOCATING_SERVICE: "定位服务",
                SOLUTION_ENABLE: "中启用定位服务，并在下面的应用列表中允许",
                SOLUTION_USE: "使用定位服务。"

            },

            forgetPassword: {
                REGISTER_EMAIL: "注册邮箱地址",
                RESET_PASSWORD: "重置密码"
            },

            chatModal: {
                CHOOSE: "选择",
                CANCEL: "取消"
            },

            LOCAL: {

                SAVE_TO_PHONE: "保存到手机",

                SAVE: "保存",

                CHECK_UPDATE: "更新至",
                IS_UPDATED: "已是最新版本",
                GET_VERSION_FAIL: "无法获取最新版本",

                PROMPT_LEAVE: "确定离开？"

            },

            COMMON: {
                ERR_TITLE: "错误",
                INFO_TITLE: "提示",
                SET_SUCCESS: "设置成功",
                SET_FAILURE: "设置失败"
            },

            changeiconctrl: {
                SMALL_ICON: "图片大小不得小于160x160像素！"
            },

            changefullnamectrl: {
                FULLNAME_EMPTY: "名称不能为空",
                FULLNAME_TOO_LARGE: "名称最长不超过32个字符"
            },

            changepwdctrl: {
                PROMPT_EMPTY: "原密码和新密码都不能为空",
                PROMPT_PWD_ERROR: "原密码错误",
                PROMPT_VERIFY_ERROR: "两次输入的新密码不一致",
                PROMPT_SAME_ERROR: "新密码不能和原密码相同",
                PROMPT_LENGTH: "密码长度不能超过16"
            },

            conversationsctrl: {
                NO_MESSAGE: "暂无消息，向右滑动查看主菜单。"
            },

            GLOBAL: {
                ERR_TOKEN: "无法获取token",
                ERR_NET: "无法连接服务器",
                ERR_LOGIN: "无法登录",
                ERR_USERPASS: "用户名称密码不匹配",
                ERR_IOSTOKEN: "获取推送消息标识出错",
                ERR_NO_SERVER: "没有选中任何服务器",
                ERR_NO_PASSWORD_EMAIL: "没有填写邮箱或密码",
                ERR_NO_ENOUGH_INFO: "提供的参数不够",

                ONLINE: "在线",
                OFFLINE: "离线",

                NO_AVAILABLE_CONTACT: "没有可添加的联系人",
                NO_AVAILABLE_GROUP: "没有可用的组",
                NO_AVAILABLE_SERVANT: "该组没有可用的客服",
                
                CANT_GET_MORE_HISTORY_MESSAGES: "无法获取更多历史消息",
                CANT_GET_MORE_CONVERSATIONS: "无法获取更多对话",
                CANT_REFRESH_CONVERSATIONS: "无法刷新对话",
                
                TITLE_FILE:        "文件消息",
                TITLE_AUDIO:       "语音消息",
                TITLE_TEXT:        "文本消息",
                TITLE_TXT:         "文本消息",
                TITLE_IMAGE:       "图片消息",
                TITLE_SINGLE_CARD:   "图文消息",
                TITLE_MULTIPLE_CARD: "图文消息",
                TITLE_GPS_LOCATION:  "位置消息",
                TITLE_ACCEPT_CONTACT: "接受邀请消息",
                TITLE_DG_INVITED:     "加入群聊消息",
                TITLE_DESKTOP:        "收到新消息",
                TITLE_REQUEST_JOIN_OG: "请求消息",
                TITLE_APPROVE_JOIN_OG: "同意消息",
                TITLE_LOGOUT:          "退出登录消息",
                TITLE_UNKNOWN:            "未知消息",

                CANT_OPEN_FILE:        "不能打开此文件",
                
                SHOW_BADGE: "显示未读消息数",
                SHOW_BADGE_NOTE: "新消息到达时，在应用图标上显示未读消息数",
                MUTE_NOTIFICATION: "不显示通知",
                MUTE_NOTIFICATION_NOTE: "新消息到达时，不显示任何通知",
                SILENCE_NOTIFICATION: "仅显示文字通知",
                SILENCE_NOTIFICATION_NOTE: "新消息到达时，仅显示文字通知，没有声音提示",
                MUTE_OTHER_MOBILE_DEVICE: "移动设备不显示通知",
                MUTE_OTHER_MOBILE_DEVICE_NOTE: "网页和移动设备同时在线时，移动设备不显示消息通知",
                IS_DISTRIBUTOR_USER: "设为分发者",
                IS_DISTRIBUTOR_USER_NOTE: "作为分发者，你会收到任何用户发来的消息，并具有分配对话给其他客服的能力",

                BODY_REQUEST_JOIN_OG: "请求加入组织",
                BODY_APPROVE_JOIN_OG: "同意加入组织",

                //messagebody
                BODY_CHAT_MESSAGE_REQUEST_JOIN_OG: "我想要请求加入组织：",

                TIMESTAMP_LANGUAGE: "zh-cn",
                TIMESTAMP_FORMAT: "MM月DD日 HH:mm",

                MESSAGE_DG_INVITED: "我邀请你加入了群聊",
                MESSAGE_ACCEPT_CONTACT: "我接受了你的邀请，现在我们是好友了",
                MESSAGE_INVITE_CONTACT: "我想要加你为好友.",
                MESSAGE_APPROVE_JOIN_OG: "我已同意你加入组织：",

                ALERT_OK: "确定",
                ALERT_CANCEL: "取消",
                CLOSE: "关闭",
                SAVE: "保存",
                SAVE_PHOTO_SUCCESS: "图片已保存到相册",
                SAVE_PHOTO_FAILURE: "图片保存失败",
                DOWNLOAD_FAILURE: "下载失败",

                RECORD_CANCEL: "手指上滑，取消发送",
                RECORD_RELEASE: "松开手指，取消发送",
                CANCEL_REC_TIP: "手指上滑，取消发送",

                LOGIN_IN_ANOTHER_DEVICE: "你的账户在其他设备上登录",

                FILE: "文件",
                PICTURE: "图片",
                CAMERA: "拍照",
                LOCATION: "位置",
                SLACK: "Slack",
                EVERNOTE: "印象笔记",

                ASSIGN_TO: "对话分配给： ",

                CANCEL: "取消",
                COPY: "复制",
                FORWARD: "转发",
                DELETE: "删除",
                LOCK: "加锁",
                UNLOCK: "解锁",

                RELOAD: "重新加载",
                SEARCH: "搜索",
                YESTERDAY: "昨天",

                UPDATE_TITLE: "有新版本！",
                UPDATE_CONTENT1: "当前版本为",
                UPDATE_CONTENT2: ", 是否升级到最新版本",
                UPDATE_CONTENT3: " ？",

                UPDATE_FAILED: "更新失败",
                UPDATE_SUCCESS: "更新成功",

                NO_RECENT_MESSAGE: "没有最近消息",
                NO_MORE_HISTORY_MESSAGES: "没有更多的历史消息",
                
                CHECKING_FILE: "检查文件 ...",
                UPLOADING_FILE: "上传文件 ...",
                SENDING: "发送消息 ...",
                CANCELED: "已取消",                
                TYPING: "正在输入 ",
                
                CONVERSATIONS: "对话",
                CONTACTS: " 联系人",
                SELECT_APP: "选择应用",
                PRECEED: "继续",
                QUIT: "退出",
                REMEMBER_MY_CHOICE: "记住我的选择",
                NO_CONVERSATION_SELECTED: "未选中任何对话",
                NO_CONTACT_SELECTED: "未选中任何联系人",
                NO_SETTING_SELECTED: "未选中任何设置项",
                NO_CONVERSATION: "没有对话",
                NO_CONTACT: "没有联系人",
                NO_RESULTS: "没有结果",
                YOU_DONT_HAVE_ANY_APP: "你没有任何应用",
                ON_BEFORE_UNLOAD_WARNING: "关闭窗口会导致退出登录",
                NO_MATCH_RESULTS: "没有符合的结果",

                ADD_MEMBER: "添加成员",
                ADD_BY_CONTACT: "按联系人添加",
                ADD_BY_GROUP: "按组添加",
            }
        }
    }

});

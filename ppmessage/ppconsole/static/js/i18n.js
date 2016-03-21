/*
 *  guijin.ding@yvertical.com
 *  Copyright (c) 2010-2015 
 */

angular.module("this_app.i18n", ["pascalprecht.translate"])
    .constant("yvTransTags", {
        en: {

            COPYRIGHT_PPMESSAGE: "PPMESSAGE.",

            app: {
                MY_PROFILE_TAG: "My Profile",
                LOGOUT_TAG: "Logout",
                LOGIN_TAG: "Login",
                DOWNLOAD: "Download",
                CONTACT_US:"Contact us",

                START_SERVICE_TAG: "Start service",
                PRIVATE_CONFIG_TAG: "Private settings",
                TEAM_CONFIG_TAG: "Team settings",
                EXIT_APP_TAG: "Log Out",
                SIGNUP_TAG: "Sign Up",
                LOGIN_TAG: "Sign In",
                SLOGAN: "Open Source Plug & Play Customer Communication Platform",

                APPS: "Apps",
                
            },

            calendar:{
                TODAY_TAG: "Today",
                YESTERDAY_TAG: "Yesterday",
                LAST_7_DAYS_TAG:"Last 7 Days",
                LAST_30_DAYS_TAG:"Last 30 Days",
                THIS_MONTH_TAG:"This Month",
                LAST_MONTH_TAG:"Last Month",
                /*按钮文本定义开始*/
                APPLY_LABEL_TAG:"Apply",
                CANCEL_LABEL_TAG:"Cancel",
                FROM_LABEL_TAG:"From",
                TO_LABEL_TAG:"To",
                CUSTOM_RANGE_LABEL_TAG:"Custom Range",
                monthname:{
                    JANUARY_TAG:"January",
                    FEBRUARY_TAG:"February",
                    MARCH_TAG:"March",
                    APRIL_TAG:"April",
                    MAY_TAG:"May",
                    JUNE_TAG:"June",
                    JULY_TAG:"July",
                    AUGUST_TAG:"August",
                    SEPTEMBER_TAG:"September",
                    OCTOBER_TAG:"October",
                    NOVEMBER_TAG:"November",
                    DECEMBER_TAG:"December",
                },
                /*按钮文本定义结束*/
            },//calendar end

            main: {
                LEARN_MORE_TAG: "LEARN MORE",
                PLUG_AND_PLAY_TAG: "PLUG AND PLAY",
                MULTIPLE_PLATFORMS_TAG: "MULTIPLE PLATFORMS",
                THE_MESSAGING_SYSTEM_IN_APPLICATIONS: "THE MESSAGING SYSTEM IN APPLICATIONS",

            },

            signup: {
                PARAMS_MISS_TAG: "Params miss",
                FULLNAME_ERROR_TAG: "Fullname empty or out of length",
                NO_FIRSTNAME_TAG: "Please input your first name.",
                NO_LASTNAME_TAG: "Please input your last name.",
                NO_FULLNAME_TAG: "fullname required",
                NO_EMAIL_TAG: "email required",
                NO_PASSWORD_TAG: "password required",
                NO_RPASSWORD_TAG: "repeat password required",
                NO_AGREE_TAG: "agreement agree required",
                PASSWORD_NOT_MATCHED_TAG: "password not matched",
                EMAIL_USED_TAG: "This email already has been taken.",
                SIGNUP_ERROR_TAG: "signup meet error",
                SIGNUP_SUCCESS_TAG: "signup successfully",

                SERVICE_ERROR_TAG: "Signup service error.",
                FULLNAME_UNREGULAR_TAG: "Illegal fullname",
                PASSWORD_UNREGULAR_TAG: "Illegal password",
                FIRST_NAME_TOO_LONG_TAG: "First name is too long",
                LAST_NAME_TOO_LONG_TAG: "Last name is too long",
                EMAIL_TOO_LONG_TAG: "Email is too long",
                COMPANY_NAME_TOO_LONG_TAG: "Company name is too long",
                EMAIL_UNREACHABLE_TAG: "Email is unreachable",
                EMAIL_LOGIN_ERROR_TAG: "System busy,cann't send email，please try again or contact us",
                EMAIL_SENDING_ERROR_TAG: "Sending email encounter an error.please contact us or jusr try again",
                LENGTH_OUT_OF_RANGE_TAG: "Length out of range",

                ERR_PASSWORD_CONTAINS_WHITESPACE_AT_HEAD_OR_TAIL: 'Password contains whitespace at head or tail',

                SIGNUP_TAG: "Sign Up",
                CREATE_TEAM_TAG: "Create Team",
                START_TAG: "Start",
                FULLNAME_TAG: "Full Name",
                LOGIN_NAME_TAG: "Login Email",
                LOGIN_PASSWORD_TAG: "Password",
                LOGIN_PASSWORD_REPEAT_TAG: "Password Repeat",
                SERVICE_TEAM_TAG: "Service Team",
                AGREE_SERVICE_TEAM_TAG: "Agree with ",
                MAKE_NAME_FOR_YOURTEAM: "Make an amazing name for your team !",
                TEAM_NAME: "Team name",
                CONGRATULATIONS: "Congratulations! customer service team create success",
                YOU_WILL_EXPERIENCE: "You will experience",
                ANY_TRAFFIC: "Any traffic",
                ANY_MESSAGE: "Any number of messages",
                YOU_CAN: "Start use, you can: ",
                DEPLOY_CODE: "Deploy you code",
                ADD_SERVICE_USER: "Add service user",
                MODIFY_SETTINGS: "Modify information",
                
            },

            createaccount: {
                ACCOUNT_ALREADY_CREATED: "Account already created.",
                NO_PASSWORD_TAG: "Password required.",
            },

            login: {
                INVALID_EMAIL_TAG: "Invalid email address.",
                NO_EMAIL_TAG: "email required",
                NO_PASSWORD_TAG: "password required",
                NO_SUCH_USER_TAG: "No such user.",
                PASSWORD_MISMATCH_TAG: "Incorrect password.",
                LOGIN_FAILED_TAG: "login failed.",
                NO_AUTHORITY_LOGIN_TAG: "no authority to log in.",

                LOGIN_TAG: "Log In",
                LOGIN_EMAIL_PLACEHOLDER_TAG: "Email",
                LOGIN_PASSWORD_TAG: "Password",
                LOGIN_FORGET_PASSWORD_TAG: "Forget password?",
                LOGIN_REGISTER_TAG: "Register"
                
            },

            changepassword: {
                NO_PASSWORD_TAG: "Please enter your password.",
                PASSWORD_NOT_MATCH_TAG: "The two entered passwords are different.",
                CHANGE_PASSWORD_SUCCESS_TAG: "Change password successfully.",
                CHANGE_PASSWORD_FAIL_TAG: "Change password failed.",
            },

            settings: {
                menu: {
                    DATA_ANALYSIS_TAG: "Data analysis",
                    DATA_OVERVIEW_TAG: "Data overview",
                    HISTORY_MSG_TAG: "Message historys",
                    TEAM_CONFIG_TAG: "Team settings",
                    BASIC_CONFIG_TAG: "Basic info",
                    USER_INTERFACE_TAG: "User interface",
                    MESSAGE_DISPATCH_TAG: "Message dispatch",
                    SERVICE_USER_TAG: "Service users",
                    SERVICE_GROUP_TAG: "Service users group",
                    APP_INTEGRAGE_TAG: "App integrate",
                    ACCOUT_CONFIG_TAG: "Account settings",
                    ADVANCED_CONFIG_TAG: "Advanced settings"
                },
                
                profile: {
                    UPDATE_SUCCESSFULLY_TAG: "Profile updated successfully.",
                    UPDATE_FAILED_TAG: "Profile updated failed.",
                },

                account: {
                    OLDPASSWORD_MISMATCH_TAG: "Old password mismatch.",
                    NEWPASSWORD_MISMATCH_TAG: "New password and confirm new password not equal.",
                    REMOVE_USER_PROMOTE_TAG: "Very important.",
                    REMOVE_USER_FAILED_TAG: "Remove user failed.",
                    NO_EMAIL_OR_PASSWORD_TAG: "No email or password provided.",
                },

                resetpassword: {
                    NO_EMAIL_TAG: "Please enter your email.",
                    EMAIL_NOT_MATCH_TAG: "Invalid email. Please enter the correct email.",
                    SERVICE_ERROR_TAG: "Some error occurred. Please retry in a minute",
                    ERR_NO_USER: "Can not find user with this email",
                },

                createapplication: {
                    NO_APPNAME_TAG: "Please enter the name of app.",
                    CREATEAPP_SUCCESSFULLY_TAG: "Create app successfully.",
                    CREATEAPP_FAILED_TAG: "Create app failed",
                    APP_ALREADY_EXITED_TAG: "This name already exited. Please use another name",
                    APP_NAME_LENGTH_LIMIT_TAG: "App name is too long",
                    CONTAIN_UNREGULAR_WORDS_TAG: "Unregular words contained",
                },
            },

            payment: {
                pay: {
                    CHOOSE_AGENT_SMALLER_THAN_EXIST_AGENT_TAG: "The agents number is smaller than current exist agent numbers,please reduce your team member or expand the agent numbers. Thanks",
                },

                payment: {
                    
                },

                pwechat: {
                    
                },
            },
            
            application: {
                profile: {
                    UPDATE_SUCCESSFULLY_TAG: "Profile updated successfully.",
                    UPDATE_FAILED_TAG: "Profile updated failed.",
                    UPDATE_APP_LACK_PARAMS_TAG: "Update team info needs more params",
                    UPDATE_APP_NOT_EXIST_TAG: "Update team not exist",
                    UPDATE_APP_NAME_OUT_OF_LENGTH_TAG: "Update name out of length",
                    REMOVE_APP_SUCCESS_TAG: "Remove team success",
                    PERMISSSION_DENIED_TAG: "Permission denied, you are not team owner",
                    NO_CHANGE_TAG: "No changes since last change",
                    NOT_REGULAR_WORDS_TAG: "Not allow unregular words",
                    WORDS_OUT_OF_LENGHT_TAG: "The name is too long",
                    COPY_SUCCESSFUL_TAG: "Copy to clipboard success!",
                    COPY_FAIL_TAG: "Copy to clipboard failed!",
                },

                account: {
                    OLDPASSWORD_MISMATCH_TAG: "Old password mismatch.",
                    NEWPASSWORD_MISMATCH_TAG: "New password and confirm new password not equal.",
                },

                resetpassword: {
                    NO_EMAIL_TAG: "Please enter your email.",
                    EMAIL_NOT_MATCH_TAG: "Invalid email. Please enter the correct email.",
                    SERVICE_ERROR_TAG: "Some error occurred. Please retry in a minute",

                    FIND_PASSWORD_TAG: "Find password",
                    LOGIN_EMAIL_TAG: "Email",
                    FIND_TAG: "Send email",
                    
                },

                welcome: {
                    UPDATE_APP_SUCCESSFULLY_TAG: "update team info successfully",
                    UPDATE_APP_LACK_PARAMS_TAG: "need more params",
                    UPDATE_APP_NOT_EXIST_TAG: "app not exist",
                    WELCOME_WORDS_OUT_OF_LENGTH_TAG: "welcome words or offline notice out of length",
                    COLOR_PICKED_NOT_RIGHT_TAG: "color picked is unregualr value",
                    UPDATE_ENCOUNTER_AN_ERROR_TAG: "encounter an error,please try again",
                    NO_CHANGED_TAG: "No change",

                    WELCOME_INFO_TAG: "Welcome",
                    SAVE_TAG: "Save",
                    AUTO_POPUP: "Auto Popup",
                    POPUP_ONLY_ONCE: "Only once",
                    POPUP_NEVER: "Never",
                    POPUP_ALWAYS: "Always",
                    COLOR: "Color",
                    
                },

                grouping: {
                    WORDS_OUT_OF_LENGTH_TAG: "length out of range",
                    UNREGULAR_WORDS_TAG: "unregular words",
                    NO_ORG_GROUP_TAG: "no group exists",
                    LACK_PARAMS_TAG: "lack params",
                    NOT_LIST_TAG: "not list params",
                    ADD_GROUP_USER_SUCCESS_TAG: "add group user successful",
                    ENCOUNTER_AN_ERROR_TAG: "operation error",
                    REMOVE_GROUP_SUCCESS_TAG: "remove group successful",
                    UPDATE_GROUP_SUCCESS_TAG: "update group successful",
                    CREATE_GROUP_SUCCESS_TAG: "create group successful",
                    MODIFY_INFO_IS_NOT_SUITABLE_TAG: "what you write is not suitable",
                    NO_GROUP_USER_SELECTED_TAG: "no group user selected",
                    GROUP_NAME_EXISTED_TAG: "group name already existed",
                    NO_GROUP_NAME: "group name can't be empty",
                    NO_GROUP_DESC: "group description can't be empty",

                    SERVICE_GROUP_MANAGER_TAG: "Service group manager",
                    MOVE_TO: "Move to ",
                    SELECT_GROUP: "Select group",
                    ALL_SERVICE_USER: "all service users",
                    NEW_GROUP: "Create",
                    SELECT_ALL: "Select all",
                    LOGIN_EMAIL: "Email",
                    ROLE: "Role",
                    GROUP_IN: "Group",
                    GROUP_MODE_CONFIG: "Group config",
                    IS_SHOW_GROUP: "Show",
                    GROUP_NAME: "Group name",
                    DISPATCH_WAY: "Dispatch mode",
                    CREATE_GROUP: "Create Group",
                    GROUP_DESC: "Group Infos",
                    MODIFY_GROUP: "Modify Group",
                    SAVE: "Save"
                    
                },

                people: {
                    SEND_INVITATION_EMAIL_SUCCESSFULLY_TAG: "Send the invitation email successfully.",
                    SEND_INVITATION_EMAIL_FAILED_TAG: "Send the invitation email failed.",
                    CREATE_APP_USER_SUCCESSFULLY_TAG:"Add user successfully.",
                    CREATE_APP_USER_FAILED_TAG:"Add user failed.",
                    USER_EXIST_AND_INVITE_TAG:"user existed,please invite directly",
                    REMOVE_APP_USER_SUCCESSFULLY_TAG:"Remove successfully.",
                    REMOVE_APP_USER_FAILED_TAG:"Remove failed.",
                    ALREADY_IS_APP_USER_TAG:"This user has already been app user.",
                    QUOTA_REACH_TO_UPPER_LIMIT_TAG:"Agent quote reach to upper limit.",
                    PARAMS_MISS_TAG: "Params miss",
                    PERMISSION_DENY_TAG: "You are not allow to create team member",

                    CREATE_SERVICE_USER_TAG: "Create service user",
                    SEARCH_TAG: "Search",
                    SELECT_ALL_TAG: "Select all",
                    REMOVE_SERVICE_USER_TAG: "Remove",
                    OWNER_TAG: "Owner",
                    SERVICE_USER_TAG: "Service user",
                    CANCEL_TAG: "Cancel",
                    OK_TAG: "Ok",
                    SERVICE_USER_NAME_TAG: "Username",
                    SERVICE_USER_EMAIL_TAG: "Email",
                    PASSWORD_TAG: "Password",
                    CONFIRM_PASSWORD_TAG: "Confirm password",
                    CREATE_TAG: "Create"
                    
                },

                manualinstall: {
                    COPY_SUCCESSFUL_TAG: "Copy to clipboard success!",
                },

                integrate: {
                    COPY_TO_CLIPBOARD: "Copy to clipboard",
                    PREVIEW: "Preview",
                    URL_LINK: "Url",
                    DEMO_DEPLOY_TO: "PPMessage has deploy to this website for preview",
                    COPY_CODE_TO_BODY: "Copy the code below, and paste between <body></body>"
                },

                teamprofile: {
                    TEAM_INFO: "Team info",
                    TEAM_NAME: "Team name",
                    SAVE: "Save"
                }
                
            },

            statistics: {

                overview: {
                    OVERVIEW_TAG: 'Overview',
                    TODAY_CUSTOMER_TAG: 'Today customer',
                    YESTERDAY_CUSTOMER_TAG: 'Yesterday customer',
                    ALL_CUSTOMER_TAG: 'All customer',
                    ALL_MESSAGE_TAG: 'All message',
                    REALTIME_DATA_TAG: 'Today data',
                    REALTIME_CUSTOMER_TAG: 'Customer',
                    REALTIME_SERVICE_TAG: 'Service',
                    REALTIME_MESSAGE_TAG: 'Message',
                    HISTORY_DATA_TAG: 'History data',
                    HISTORY_CUSTOMER_TAG: 'Customer',
                    HISTORY_SERVICE_TAG: 'Service',
                    HISTORY_MESSAGE_TAG: 'Message',
                    MAX_RANGE_TAG: 'Less than 30 days',
                },
                
                historymessages: {
                    MESSAGE_FILE_TYPE_TAG: 'File',
                    MESSAGE_IMAGE_TYPE_TAG: 'Image',
                    MESSAGE_TXT_TYPE_TAG: 'Large text',
                    MESSAGE_GET_ERROR_TAG: "Get history message error.",

                    SEARCH_TAG: "Search",
                    MESSAGE_LIST_TAG: "Messages",
                    EMPTY_LIST_TAG: "Empty",
                    MESSAGES: "Messages",
                    MESSAGES_PREVIEW: "Messages preview",
                    
                },

                messageroute:  {
                    ALL: "ALL",
                    SMART: "SMART",
                    GROUP: "GROUP",
                    ROBOT: "ROBOT"
                },

                userprofile: {
                    EMAIL_TAG: "Email",
                    USER_NAME_TAG: "Username",
                    SAVE_TAG: "Save",
                },

                advanced_settings: {
                    CHANGE_PASSWORD_TAG: "Change Password",
                    CURRENT_PASSWORD_TAG: "Current password",
                    NEW_PASSWORD_TAG: "New password",
                    REPEAT_NEW_PASSWORD_TAG: "New password repeat",
                    SAVE_TAG: "Save",
                    FORGET_PASSWORD_TAG: "Forget password"
                },
                
            }

        },

        cn: {
            COPYRIGHT_PPMESSAGE: "皮皮消息.",

            app: {
                MY_PROFILE_TAG: "我的信息",
                LOGOUT_TAG: "登出",
                LOGIN_TAG: "登入",
                DOWNLOAD: "下载",
                CONTACT_US:"联系我们",

                START_SERVICE_TAG: "开始服务",
                PRIVATE_CONFIG_TAG: "个人设置",
                TEAM_CONFIG_TAG: "团队设置",
                EXIT_APP_TAG: "退出",
                SIGNUP_TAG: "注册",
                LOGIN_TAG: "登录",
                SLOGAN: "开源在线客服平台",

                APPS: "所有团队",
                
            },

            calendar:{
                TODAY_TAG: "今天",
                YESTERDAY_TAG:"昨天",
                LAST_7_DAYS_TAG:"最近7天",
                LAST_30_DAYS_TAG:"最近30天",
                THIS_MONTH_TAG:"本月",
                LAST_MONTH_TAG:"上一个月",
                /*按钮文本开始*/
                APPLY_LABEL_TAG:"应用",
                CANCEL_LABEL_TAG:"取消",
                FROM_LABEL_TAG:"从",
                TO_LABEL_TAG:"到",
                CUSTOM_RANGE_LABEL_TAG:"定制范围",
                monthname:{
                    JANUARY_TAG:"一月",
                    FEBRUARY_TAG:"二月",
                    MARCH_TAG:"三月",
                    APRIL_TAG:"四月",
                    MAY_TAG:"五月",
                    JUNE_TAG:"六月",
                    JULY_TAG:"七月",
                    AUGUST_TAG:"八月",
                    SEPTEMBER_TAG:"九月",
                    OCTOBER_TAG:"十月",
                    NOVEMBER_TAG:"十一月",
                    DECEMBER_TAG:"十二月",
                },
                /*按钮文本定义结束*/
            },//calendar   

            main: {
                LEARN_MORE_TAG: "了解更多",
                PLUG_AND_PLAY_TAG: "即插即用",
                MULTIPLE_PLATFORMS_TAG: "多平台",
                THE_MESSAGING_SYSTEM_IN_APPLICATIONS: "应用内消息系统",

            },

            signup: {
                PARAMS_MISS_TAG: "参数缺失",
                FULLNAME_ERROR_TAG: "姓名缺失或长度超过限制",
                NO_FIRSTNAME_TAG: "请输入您的名字",
                NO_LASTNAME_TAG: "请输入您的姓",
                NO_FULLNAME_TAG: "姓名缺失",
                NO_EMAIL_TAG: "邮箱缺失或者格式不正确",
                NO_PASSWORD_TAG: "密码缺失或者格式不正确",
                NO_RPASSWORD_TAG: "请再次输入密码",
                NO_AGREE_TAG: "请同意我们的协议",
                PASSWORD_NOT_MATCHED_TAG: "两次密码不匹配",
                EMAIL_USED_TAG: "该邮箱已被占用",
                SIGNUP_ERROR_TAG: "注册遇到错误",
                SIGNUP_SUCCESS_TAG: "注册成功",
                SERVICE_ERROR_TAG: "注册服务错误",
                FULLNAME_UNREGULAR_TAG: "用户全名不要使用非常规字符",
                PASSWORD_UNREGULAR_TAG: "用户密码不要使用非常规字符",
                FIRST_NAME_TOO_LONG_TAG: "名--长度超过限制",
                LAST_NAME_TOO_LONG_TAG: "姓--长度超过限制",
                EMAIL_TOO_LONG_TAG: "邮件--长度超过限制",
                COMPANY_NAME_TOO_LONG_TAG: "公司名字--长度超过限制",
                EMAIL_UNREACHABLE_TAG: "无法发送邮件，邮箱不可达",
                EMAIL_LOGIN_ERROR_TAG: "系统繁忙，无法登录邮箱发送邮件，请重新发送或者联系我们",
                EMAIL_SENDING_ERROR_TAG: "邮件发送失败，请重新发送或者联系我们",
                LENGTH_OUT_OF_RANGE_TAG: "长度超过限制",
                ERR_PASSWORD_CONTAINS_WHITESPACE_AT_HEAD_OR_TAIL: '密码开头或结尾不允许包含空格',

                SIGNUP_TAG: "注册",
                CREATE_TEAM_TAG: "创建客服团队",
                START_TAG: "开始使用",
                FULLNAME_TAG: "真实姓名",
                LOGIN_NAME_TAG: "登录邮箱",
                LOGIN_PASSWORD_TAG: "密码",
                LOGIN_PASSWORD_REPEAT_TAG: "确认密码",
                SERVICE_TEAM_TAG: "服务条款",
                AGREE_SERVICE_TEAM_TAG: "注册并登录意味着同意本网站",
                MAKE_NAME_FOR_YOURTEAM: "为您的团队起一个响亮的名字吧!",
                TEAM_NAME: "客服团队名称",
                CONGRATULATIONS: "恭喜您，客服团队创建成功!",
                YOU_WILL_EXPERIENCE: "您将体验",
                ANY_TRAFFIC: "不限流量",
                ANY_MESSAGE: "不限消息",
                YOU_CAN: "开始使用，您可以：",
                DEPLOY_CODE: "代码部署",
                ADD_SERVICE_USER: "添加客服",
                MODIFY_SETTINGS: "修改信息",
                
            },

            createaccount: {
                ACCOUNT_ALREADY_CREATED: "账户已经被创建了。",
                NO_PASSWORD_TAG: "需要填写密码。",
            },

            login: {
                INVALID_EMAIL_TAG: "无效的EMAIL地址",
                NO_EMAIL_TAG: "需要填写EMAIL地址。",
                NO_PASSWORD_TAG: "需要填写密码。",

                NO_SUCH_USER_TAG: "无此用户。",
                PASSWORD_MISMATCH_TAG: "密码错误。",
                LOGIN_FAILED_TAG: "登录失败。",

                LOGIN_TAG: "登录",
                LOGIN_EMAIL_PLACEHOLDER_TAG: "登录邮箱",
                LOGIN_PASSWORD_TAG: "密码",
                LOGIN_FORGET_PASSWORD_TAG: "忘记密码?",
                LOGIN_REGISTER_TAG: "注册"
                
            },

            changepassword: {
                NO_PASSWORD_TAG: "请输入你的密码。",
                PASSWORD_NOT_MATCH_TAG: "两次输入的密码不同。",
                CHANGE_PASSWORD_SUCCESS_TAG: "修改密码成功。",
                CHANGE_PASSWORD_FAIL_TAG: "修改密码失败。",
            },

            settings: {
                menu: {
                    DATA_ANALYSIS_TAG: "数据分析",
                    DATA_OVERVIEW_TAG: "数据总览",
                    HISTORY_MSG_TAG: "历史消息",
                    TEAM_CONFIG_TAG: "团队设置",
                    BASIC_CONFIG_TAG: "基本信息",
                    USER_INTERFACE_TAG: "用户界面",
                    MESSAGE_DISPATCH_TAG: "消息分流",
                    SERVICE_USER_TAG: "客服人员",
                    SERVICE_GROUP_TAG: "客服分组",
                    APP_INTEGRAGE_TAG: "应用集成",
                    ACCOUT_CONFIG_TAG: "账户设置",
                    ADVANCED_CONFIG_TAG: "高级设置"
                },
                
                profile: {
                    UPDATE_SUCCESSFULLY_TAG: "更新成功。",
                    UPDATE_FAILED_TAG: "更新失败。",
                },
                
                account: {
                    OLDPASSWORD_MISMATCH_TAG: "原密码输入错误",
                    NEWPASSWORD_MISMATCH_TAG: "新密码两次输入不同",
                    REMOVE_USER_PROMOTE_TAG: "重要的说明看三遍",
                    REMOVE_USER_FAILED_TAG: "注销用户失败",
                    NO_EMAIL_OR_PASSWORD_TAG: "没提供邮件或者密码",
                },

                resetpassword: {
                    NO_EMAIL_TAG: "请输入您的邮箱",
                    EMAIL_NOT_MATCH_TAG: "邮箱和此账号不匹配，请输入正确的邮箱",
                    SERVICE_ERROR_TAG: "发生了一些错误，请稍后重试",
                    ERR_NO_USER: "此用户不存在",
                },

                createapplication: {
                    NO_APPNAME_TAG: "请输入团队的名称。",
                    CREATEAPP_SUCCESSFULLY_TAG: "创建团队成功。",
                    CREATEAPP_FAILED_TAG: "创建团队失败。",
                    APP_ALREADY_EXITED_TAG: "这个名字已经使用，请换一个名字。",
                    APP_NAME_LENGTH_LIMIT_TAG: "团队名字超过长度",
                    CONTAIN_UNREGULAR_WORDS_TAG: "团队名称包含非常规字符",
                },
            },

            payment: {
                pay: {
                    CHOOSE_AGENT_SMALLER_THAN_EXIST_AGENT_TAG: "您当前所选坐席数小于团队实际坐席数，请扩大坐席数或删除一些坐席再来选购，谢谢",
                },

                payment: {
                    
                },

                pwechat: {
                    
                },
            },
            
            application: {
                profile: {
                    UPDATE_SUCCESSFULLY_TAG: "更新成功。",
                    UPDATE_FAILED_TAG: "更新失败。",
                    UPDATE_APP_LACK_PARAMS_TAG: "修改缺乏参数",
                    UPDATE_APP_NOT_EXIST_TAG: "修改的团队不存在",
                    UPDATE_APP_NAME_OUT_OF_LENGTH_TAG: "修改的团队名超出长度",
                    REMOVE_APP_SUCCESS_TAG: "删除团队成功",
                    PERMISSSION_DENIED_TAG: "操作没有权限",
                    NO_CHANGE_TAG: "没有做出任何修改",
                    NOT_REGULAR_WORDS_TAG: "请不要使用非常规字符",
                    WORDS_OUT_OF_LENGHT_TAG: "团队名称超过限制",
                    COPY_SUCCESSFUL_TAG: "成功复制到剪贴板",
                    COPY_FAIL_TAG: "复制失败，请手动复制!",
                },
                account: {
                    OLDPASSWORD_MISMATCH_TAG: "原密码输入错误",
                    NEWPASSWORD_MISMATCH_TAG: "新密码两次输入不同",
                },

                resetpassword: {
                    NO_EMAIL_TAG: "请输入您的邮箱",
                    EMAIL_NOT_MATCH_TAG: "邮箱和此账号不匹配，请输入正确的邮箱",
                    SERVICE_ERROR_TAG: "发生了一些错误，请稍后重试",

                    FIND_PASSWORD_TAG: "找回密码",
                    LOGIN_EMAIL_TAG: "登录邮箱",
                    FIND_TAG: "发送找回密码邮件",
                },

                welcome: {
                    UPDATE_APP_SUCCESSFULLY_TAG: "更新成功",
                    UPDATE_APP_LACK_PARAMS_TAG: "参数缺失",
                    UPDATE_APP_NOT_EXIST_TAG: "应用不存在",
                    WELCOME_WORDS_OUT_OF_LENGTH_TAG: "问候语长度超过限制",
                    COLOR_PICKED_NOT_RIGHT_TAG: "颜色取值有问题",
                    UPDATE_ENCOUNTER_AN_ERROR_TAG: "更新遇到一个错误，请重试或者联系客服，谢谢",
                    NO_CHANGED_TAG: "没有任何改变",

                    WELCOME_INFO_TAG: "欢迎信息",
                    SAVE_TAG: "保存",
                    AUTO_POPUP: "自动退出",
                    POPUP_ONLY_ONCE: "仅首次",
                    POPUP_NEVER: "从不弹出",
                    POPUP_ALWAYS: "总是弹出",
                    COLOR: "图标颜色",
                    
                },

                grouping: {
                    WORDS_OUT_OF_LENGTH_TAG: "超过最大长度限制",
                    UNREGULAR_WORDS_TAG: "请不要使用非常规字符",
                    NO_ORG_GROUP_TAG: "没有找到组的信息",
                    LACK_PARAMS_TAG: "缺少必要的信息",
                    NOT_LIST_TAG: "参数格式不对",
                    ADD_GROUP_USER_SUCCESS_TAG: "添加组用户成功",
                    ENCOUNTER_AN_ERROR_TAG: "操作遇到错误，请查看控制台",
                    REMOVE_GROUP_SUCCESS_TAG: "成功移除小组",
                    UPDATE_GROUP_SUCCESS_TAG: "成功更新小组信息",
                    CREATE_GROUP_SUCCESS_TAG: "成功创建小组",
                    MODIFY_INFO_IS_NOT_SUITABLE_TAG: "所填参数不合适",
                    NO_GROUP_USER_SELECTED_TAG: "没有选择任何客服人员",
                    GROUP_NAME_EXISTED_TAG: "组名已经存在",
                    NO_GROUP_NAME: "请填写组名",
                    NO_GROUP_DESC: "请填写组的描述信息",

                    SERVICE_GROUP_MANAGER_TAG: "客服分组管理",
                    MOVE_TO: "移动到",
                    SELECT_GROUP: "选择小组",
                    ALL_SERVICE_USER: "全部客服",
                    NEW_GROUP: "新建分组",
                    SELECT_ALL: "全选",
                    LOGIN_EMAIL: "登录邮箱",
                    ROLE: "角色",
                    GROUP_IN: "分组",
                    GROUP_MODE_CONFIG: "分组模式配置",
                    IS_SHOW_GROUP: "是否显示",
                    GROUP_NAME: "组名",
                    DISPATCH_WAY: "分流方式",
                    CREATE_GROUP: "创建分组",
                    GROUP_DESC: "描述",
                    MODIFY_GROUP: "修改分组",
                    SAVE: "确认修改"
                    
                },
                
               people: {
                   SEND_INVITATION_EMAIL_SUCCESSFULLY_TAG: "发送邀请邮件成功。",
                   SEND_INVITATION_EMAIL_FAILED_TAG: "发送邀请邮件失败。",
                   CREATE_APP_USER_SUCCESSFULLY_TAG:"添加成功。",
                   CREATE_APP_USER_FAILED_TAG:"添加失败。",
                   USER_EXIST_AND_INVITE_TAG:"用户已经存在，请点击‘邀请客服人员’按钮添加",
                   REMOVE_APP_USER_SUCCESSFULLY_TAG:"删除成功。",
                   REMOVE_APP_USER_FAILED_TAG:"删除失败。",
                   ALREADY_IS_APP_USER_TAG:"这个用户已经添加，不需要重复添加。",
                   QUOTA_REACH_TO_UPPER_LIMIT_TAG:"坐席配额达到上限,请先扩容",
                   PARAMS_MISS_TAG: "参数不足",
                   PERMISSION_DENY_TAG: "只有团队owner才能创建成员",

                   CREATE_SERVICE_USER_TAG: "创建客服人员",
                   SEARCH_TAG: "搜索",
                   SELECT_ALL_TAG: "选择全部",
                   REMOVE_SERVICE_USER_TAG: "移除客服",
                   OWNER_TAG: "创建者",
                   SERVICE_USER_TAG: "客服",
                   CANCEL_TAG: "取消",
                   OK_TAG: "确定",
                   SERVICE_USER_NAME_TAG: "客服全名",
                   SERVICE_USER_EMAIL_TAG: "客服邮箱",
                   PASSWORD_TAG: "设置密码",
                   CONFIRM_PASSWORD_TAG: "确认密码",
                   CREATE_TAG: "创建"
                   
               },

                manualinstall: {
                    COPY_SUCCESSFUL_TAG: "成功复制到剪贴板.",
                },

                integrate: {
                    COPY_TO_CLIPBOARD: "复制到剪贴板",
                    PREVIEW: "马上看看",
                    URL_LINK: "生成链接",
                    DEMO_DEPLOY_TO: "PPMessage已经部署在下面的网页链接上",
                    COPY_CODE_TO_BODY: "复制下面的代码并置于<body></body>元素之间"
                },

                teamprofile: {
                    TEAM_INFO: "团队信息",
                    TEAM_NAME: "团队名称",
                    SAVE: "确认修改"
                }
                
            },

            statistics: {

                overview: {
                    OVERVIEW_TAG: '数据总览',
                    TODAY_CUSTOMER_TAG: '今日访客',
                    YESTERDAY_CUSTOMER_TAG: '昨日访客',
                    ALL_CUSTOMER_TAG: '累计访客',
                    ALL_MESSAGE_TAG: '累计消息',
                    REALTIME_DATA_TAG: '实时统计',
                    REALTIME_CUSTOMER_TAG: '访客',
                    REALTIME_SERVICE_TAG: '客服',
                    REALTIME_MESSAGE_TAG: '消息',
                    HISTORY_DATA_TAG: '历史统计',
                    HISTORY_CUSTOMER_TAG: '访客',
                    HISTORY_SERVICE_TAG: '客服',
                    HISTORY_MESSAGE_TAG: '消息',
                    MAX_RANGE_TAG: '最多30天',
                },

                historymessages: {
                    MESSAGE_FILE_TYPE_TAG: '文件',
                    MESSAGE_IMAGE_TYPE_TAG: '图片',
                    MESSAGE_TXT_TYPE_TAG: '文本消息',
                    MESSAGE_GET_ERROR_TAG: "获取历史信息错误",

                    SEARCH_TAG: "搜索",
                    MESSAGE_LIST_TAG: "消息列表",
                    EMPTY_LIST_TAG: "没有任何匹配的会话",
                    MESSAGES: "条消息",
                    MESSAGES_PREVIEW: "消息预览",
                    
                },

                messageroute: {
                    ALL: "群发模式",
                    SMART: "智能匹配",
                    GROUP: "分组模式",
                    ROBOT: "人工智能"
                },

                userprofile: {
                    EMAIL_TAG: "邮箱",
                    USER_NAME_TAG: "姓名",
                    SAVE_TAG: "确认修改",
                },

                advanced_settings: {
                    CHANGE_PASSWORD_TAG: "修改密码",
                    CURRENT_PASSWORD_TAG: "现有密码",
                    NEW_PASSWORD_TAG: "新密码",
                    REPEAT_NEW_PASSWORD_TAG: "确认新密码",
                    SAVE_TAG: "确认修改",
                    FORGET_PASSWORD_TAG: "忘记密码"
                },
                
            }

        },

    })

    .config(function($translateProvider, yvTransTags) {

        $translateProvider.translations("en", yvTransTags.en);
        $translateProvider.translations("zh-CN", yvTransTags.cn);

        $translateProvider.registerAvailableLanguageKeys(["en", "zh-CN"], {
            "en": "en",
            "en-US": "en",
            "en-UK": "en",
            "zh-CN": "zh-CN"
        });

        $translateProvider.determinePreferredLanguage(function() {
            // return navigator.language;
            return "zh-CN"
        });

        $translateProvider.fallbackLanguage("en", "zh-CN");

    });

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

                ERR_PASSWORD_CONTAINS_WHITESPACE_AT_HEAD_OR_TAIL: 'Password contains whitespace at head or tail'
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
                NO_AUTHORITY_LOGIN_TAG: "no authority to log in."
            },

            changepassword: {
                NO_PASSWORD_TAG: "Please enter your password.",
                PASSWORD_NOT_MATCH_TAG: "The two entered passwords are different.",
                CHANGE_PASSWORD_SUCCESS_TAG: "Change password successfully.",
                CHANGE_PASSWORD_FAIL_TAG: "Change password failed.",
            },

            settings: {
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
                },

                welcome: {
                    UPDATE_APP_SUCCESSFULLY_TAG: "update team info successfully",
                    UPDATE_APP_LACK_PARAMS_TAG: "need more params",
                    UPDATE_APP_NOT_EXIST_TAG: "app not exist",
                    WELCOME_WORDS_OUT_OF_LENGTH_TAG: "welcome words or offline notice out of length",
                    COLOR_PICKED_NOT_RIGHT_TAG: "color picked is unregualr value",
                    UPDATE_ENCOUNTER_AN_ERROR_TAG: "encounter an error,please try again",
                    NO_CHANGED_TAG: "No change",
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
                },

                manualinstall: {
                    COPY_SUCCESSFUL_TAG: "Copy to clipboard success!",
                },
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
                }
                
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
                ERR_PASSWORD_CONTAINS_WHITESPACE_AT_HEAD_OR_TAIL: '密码开头或结尾不允许包含空格'
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
            },

            changepassword: {
                NO_PASSWORD_TAG: "请输入你的密码。",
                PASSWORD_NOT_MATCH_TAG: "两次输入的密码不同。",
                CHANGE_PASSWORD_SUCCESS_TAG: "修改密码成功。",
                CHANGE_PASSWORD_FAIL_TAG: "修改密码失败。",
            },

            settings: {
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
                },

                welcome: {
                    UPDATE_APP_SUCCESSFULLY_TAG: "更新成功",
                    UPDATE_APP_LACK_PARAMS_TAG: "参数缺失",
                    UPDATE_APP_NOT_EXIST_TAG: "应用不存在",
                    WELCOME_WORDS_OUT_OF_LENGTH_TAG: "问候语长度超过限制",
                    COLOR_PICKED_NOT_RIGHT_TAG: "颜色取值有问题",
                    UPDATE_ENCOUNTER_AN_ERROR_TAG: "更新遇到一个错误，请重试或者联系客服，谢谢",
                    NO_CHANGED_TAG: "没有任何改变",
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
               },

                manualinstall: {
                    COPY_SUCCESSFUL_TAG: "成功复制到剪贴板.",
                },
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
                }
                
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

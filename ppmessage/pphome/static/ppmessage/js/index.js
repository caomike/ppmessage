//////////////////////////
// PPHome.IndexPage
//////////////////////////
PPHome.IndexPage = ( function() {

    var i18n_features = {
        en_US: {
            "open_title": "Open Source, Open API",
            "open_source": "Open Source",
            "open_api": "Open API",
            "from_open": "From open source: Python, Tornado, SQLAlchemy, Redis, Scikit-learn",
            "back_open": "Return open source: PPMessage, MQTT",
            "everything_api": "Everything is API",
            "developing_module": "Every module is an application server",

            "easy_support_title": "Easy integration and support all kinds of platforms",
            "support_title": "All kinds of platforms",
            "backend_support": 'PPMessage backend run on Windows、Mac OS X、Linux',
            "ppkefu_support": 'PPMessage service-end run on Windows，Mac OS X，Linux，Android，iOS，Windows Phone',
            "ppcome_support": 'PPMessage customer-end run on Web，iOS，Android',

            "easy_title": "Easy to use",
            "ppkefu_easy": 'One line code integrate in customer-end',
            "ppmessage_easy": 'One command to deploy PPMessage',
            "ppconsole_easy": 'One directive integrate with manager user interface',
            
            "oauth_title": "Unified OAuth Framework, integrating and integrated",
            "oauthing_title": "Integrate third-party serivces with OAuth",
            "slack": "Slack",
            "Evernote": "Evernote",

            "oauthed_title": "Integrated via OAuth service",
            "wordpress": "Wordpress, Drupal and other open source project",
            "b2b2c": "EZSHOP, NCSHOP, B2B2C e-commerce platform",

            "smart_title": "Real Smart Customer Communication",
            "answer_title": "Automatically Message Response",            
            "transfer_title": "Automatically Message Routing",
            "learn_conversation": "Learn from conversation between service user and costomer",
            "learn_knowledge": "Learn from knowledge base",
            "learn_behavior": "Learn from customer and service user behavior",

            "mobile_title": "Mobile First",
            "push_title": "Message Push, Never Miss",
            "android_push":  'Android （MQTT，GCM）',
            "ios_push": 'iOS （APNS）',
            "sync_title": "Message Sync, To Anywhere",
            "web_to_app": "Push to App, sync to Web",
            "send_or_recv": "No matter send or receive",
            "inapp_title": "Message In-app, From Anywhere",
            "from_web": "Message from Web",
            "from_ios": "Message from iOS App",
            "from_android": "Message from Android App",

            "data_extend_title": "Data Analysis and Unlimited Scale",
            "data_title": "Data Analysis",
            "customer_question": 'Customer question',
            "customer_behavior": 'Customer behavior',
            "analysis_online": 'Online data analysis',
            "analysis_offline": 'Offline data analysis',
            
            "extend_title": "Unlimited Scale",
            "single_point_deploy": 'Single point deployment',
            "multiple_point_deploy": 'Distributed depolyment',
            "support_extra_large": 'Support extremely large system',
            "support_extreme_small": 'Support run on your PC machine',
        },
        zh_CN: {
            "open_title": "开源、开放",
            "open_source": "开源",
            "open_api": "开放",
            "from_open": "来自开源: Python、Tornado、Scikit-Learn",
            "back_open": "回馈开源: PPMessage、MQTT",
            "everything_api": "后台是完全的API系统",
            "developing_module": "所有模块都是WEB应用，独立运行",

            "easy_support_title": "极致易用、广泛支持",
            "support_title": "广泛支持",
            "backend_support": '服务端可以部署到Windows、Mac OS X、Linux',
            "ppkefu_support": '客服端可以运行在Windows，Mac OS X，Linux，Android，iOS，Windows Phone上',
            "ppcome_support": '用户端可以运行在Web端，iOS，Android的应用端',

            "easy_title": "极致易用",
            "ppkefu_easy": '一行代码集成PPMessage用户端',
            "ppmessage_easy": '一个命令集成PPMessage API',
            "ppconsole_easy": '一个指令集成PPMessage管理界面',
            
            "oauth_title": "统一OAuth架构，集成服务，亦可被集成",
            "oauthing_title": "集成服务",
            "slack": "Slack",
            "Evernote": "Evernote",

            "oauthed_title": "开放被集成",
            "wordpress": "Wordpress、Drupal 和其它开源系统",
            "b2b2c": "EZSHOP、NCSHOP、B2B2C电子商务系统",

            "smart_title": "真正的智能",
            "answer_title": "智能回复",            
            "transfer_title": "智能路由",
            "learn_conversation": '通过学习座席与客户之间的会话',
            "learn_knowledge": '通过学习知识库',
            "learn_behavior": '通过学习用户使用的行为',

            "mobile_title": "移动优先",
            "push_title": "消息推送、实时提醒",
            "android_push":  'Android （MQTT，GCM）',
            "ios_push": 'iOS （APNS）',
            "sync_title": "消息同步、如影随行",
            "web_to_app": "Web同步到手机、手机同步到Web",
            "send_or_recv": "收发数据都同步",
            "inapp_title": "应用内消息、八面来风",
            "from_web": "消息来自Web客户",
            "from_ios": "消息来自iOS应用客户",
            "from_android": "消息来自Android应用客户",

            "data_extend_title": "数据分析和无限扩展",
            "data_title": "数据分析",
            "customer_question": '客户问题',
            "customer_behavior": '客户行为',
            "analysis_online": '在线分析',
            "analysis_offline": '离线分析',
            
            "extend_title": "无限扩展",
            "single_point_deploy": '可集中部署',
            "multiple_point_deploy": '可分布部署',
            "support_extra_large": '可支持超大系统',
            "support_extreme_small": '亦可支持超小系统',
        },
        zh_TW: {
        }
    };

    var _t = function(str) {
        var lang = "en_US";
        var path = window.location.pathname;
        if (path.indexOf("en_US") != -1) {
            lang = "en_US";
        } else if (path.indexOf("zh_CN") != -1) {
            lang = "zh_CN";
        }

        var ted = i18n_features[lang][str];
        if (!ted) {
            ted = str;
        }
        return ted;
    };
    
    var FEATURES =
        [
            {
                title: _t("open_title"),
                img: 'feature_open.png',
                features: [
                    {
                        subTitle: _t('open_source'),
                        subFeatures: [
                            _t("from_open"),
                            _t("back_open"),                            
                        ]
                    },

                    {
                        subTitle: _t("open_api"),
                        subFeatures: [
                            _t("everything_api"),
                            _t("developing_module")
                        ]
                    }
                ]
            },

            {
                title: _t("easy_support_title"),
                img: 'feature_open.png',
                features: [
                    {
                        subTitle: _t("support_title"),
                        subFeatures: [
                            _t("backend_support"),
                            _t("ppkefu_support"),
                            _t("ppcome_support"),
                        ]
                    },
                    
                    {
                        subTitle: _t("easy_title"),
                        subFeatures: [
                            _t("ppkefu_easy"),
                            _t("ppmessage_easy"),
                            _t("ppconsole_easy"),
                        ]
                    }
                ]
            },


            {
                title: _t("oauth_title"),
                img: 'feature_open.png',
                features: [
                    {
                        subTitle: _t("oauthing_title"),
                        subFeatures: [
                            'Slack',
                            'Evernote',
                            'Dropbox'                        
                        ]
                    },

                    {
                        subTitle: _t("oauthed_title"),
                        subFeatures: [
                            _t("wordpress"),
                            _t("b2b2c"),
                        ]
                    },

                ]
            },


            {
                title: _t("smart_title"),
                img: 'feature_open.png',
                features: [
                    {
                        subTitle: _t("answer_title"),
                        subFeatures: [
                            _t("learn_conversation"),
                            _t("learn_knowledge"),
                        ]
                    },
                    {
                        subTitle: _t("route_title"),
                        subFeatures: [
                            _t("learn_conversation"),
                            _t("learn_behavior"),
                        ]
                    }
                ]
            },

            {
                title: _t('mobile_title'),
                img: 'feature_open.png',
                features: [
                    {
                        subTitle: _t("push_title"),
                        subFeatures: [
                            _t("android_push"),
                            _t("ios_push"),
                        ]
                    },
                    {
                        subTitle: _t("sync_title"),
                        subFeatures: [
                            _t("web_to_app"),
                            _t('send_or_recv'),
                        ]
                    },

                    {
                        subTitle: _t("inapp_title"),
                        subFeatures: [
                            _t("from_web"),
                            _t("from_ios"),
                            _t("from_android"),
                        ]
                    }
                    
                ]
            },
             
            {
                title: _t("data_extend_title"),
                img: 'feature_open.png',
                features: [
                    {
                        subTitle: _t("data_title"),
                        subFeatures: [
                            _t("customer_question"),
                            _t("customer_behavior"),
                            _t("analysis_online"),
                            _t("analysis_offline"),
                        ]
                    },
                    
                    {
                        subTitle: _t("extend_title"),
                        subFeatures: [
                            _t("single_point_deploy"),
                            _t("multiple_point_deploy"),
                            _t("support_extra_large"),
                            _t("support_extreme_small"),
                        ]
                    }
                ]
            }
        ],

        activeIndex = 0;

    buildSmallNav();
    PPHome.Header.NavigationBar.highlight( 0 );
    PPHome.Banner.bindOnScrollEvent();

    function buildSmallNav() {
        var featuresHtml = '',
            len = FEATURES.length,
            i;
        
        for ( i=0; i<len; ++i ) {
            featuresHtml += '<li></li>';
        }

        $( '.snav ul' ).append( featuresHtml );
        $( '.snav ul li' ).on( 'click', function( e ) {
            active( $( this ).index() );
        } );
        $( '.prev' ).on( 'click', function( e ) {
            active( activeIndex - 1 );
        } );
        $( '.next' ).on( 'click', function( e ) {
            active( activeIndex + 1 );
        } );
        
        active( activeIndex );
    }

    function active( index ) {
        if ( index < 0 || index >= FEATURES.length ) return;

        activeIndex = index;
        
        var $lis = $( '.snav ul li' );
        $lis.removeClass( 'active' );
        $lis.eq( index ).addClass( 'active' );

        var feature = FEATURES [ index ],
            featureList = feature.features;
        $( '.content .column-left' )
            .animate( { opacity: 0 }, function() {
                var img = "/home/static/ppmessage/img/" + feature.img;
                $( this ).attr( 'src', img );
            } )
            .animate( { opacity: 1 } );
        
        $( '.content h2.heading-headline' )
            .animate( { opacity: 0 }, function () {
                $( this ).text( feature.title );
            } )
            .animate( { opacity: 1 } );

        var featureContentHtml = '<ul>';
        $.each( featureList, function( key, value ) {

            if ( typeof value === 'string' ) {
                
                featureContentHtml += '<li>' + value + '</li>';
                
            } else if ( typeof value === 'object' ) {

                featureContentHtml += '<li>';
                featureContentHtml += '<h3>' + value.subTitle + '</h3>';
                featureContentHtml += '<ul>';
                $.each( value.subFeatures, function( index, value ) {
                    featureContentHtml += '<li>' + value + '</li>';
                } );
                featureContentHtml += '</ul>';
                featureContentHtml += '</li>';
                
            }
            
        } );
        featureContentHtml += '</ul>';
        $( '.content .column-right' )
            .animate( { opacity: 0 }, function() {
                $( this ).empty().append( featureContentHtml );
            } )
            .animate( { opacity: 1 } );
        
    }
    
} )();

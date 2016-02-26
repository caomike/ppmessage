//////////////////////////
// PPHome.IndexPage
//////////////////////////
PPHome.IndexPage = ( function() {

    var FEATURES =
        [
            {
                title: '开源',
                img: '/static/ppmessage/img/feature_open.png',
                features: [
                    'PPMessage使用了大量的开源软件，Python，Tornado，SCIKIT-LEARN 等等',
                    '托管于GITHUB这个开源大本营',
                    '相对于开源世界的光辉，PPMessage愿意为之贡献一点点绿意作为回馈。',
                    '对于开发者，Fork一下，PPMessage就是你的',
                    '对于企业，可以选择部署PPMessage到自己的INTERNET或者INTRANET'
                ]
            },

            {
                title: '开放',
                img: '/static/ppmessage/img/feature_open.png',
                features: [
                    'PPMessage各个模块通过HTTP WEB SERVICE耦合',
                    '一切都是 HTTP API （Everything is API in PPMessage.)',
                    '开发者选择开发替换其中任何模块'
                ]
            },

            {
                title: '生态',
                img: '/static/ppmessage/img/feature_open.png',
                features: [
                    '开发者开发的PPMessage模块，可以自行使用，也可以分享给其他PPMessage用户',
                    '开发者可以选择收费、免费，开源或者闭源'
                ]
            },

            {
                title: '全平台支持',
                img: '/static/ppmessage/img/feature_open.png',
                features: [
                    'PPMessage服务端可以部署到Windows、Mac OS X、Linux',
                    'PPMessage的客服端可以运行在Windows，Mac OS X，Linux，Android，iOS，Windows Phone上',
                    'PPMessage的用户端可以运行在Web端，iOS，Android的应用端'
                ]
            },

            {
                title: '体验的一致性',
                img: '/static/ppmessage/img/feature_open.png',
                features: [
                    'CORDOVA IONIC ANGULARJS ELECTRON的技术应用使PPMessage所有的客服端源于同一份代码',
                    '提供同样的操作体验'
                ]
            },

            {
                title: '极致的易用性',
                img: '/static/ppmessage/img/feature_open.png',
                features: [
                    '一行代码集成PPMessage用户端',
                    '一个命令集成PPMessage API',
                    '一个指令集成PPMessage管理界面'
                ]
            },

            {
                title: '统一框架集成获取第三方信息与服务',
                img: '/static/ppmessage/img/feature_open.png',
                features: [
                    {
                        subTitle: '统一框架 获取任何 基于OAuth的第三方信息与服务',
                        subFeatures: [
                            'Slack',
                            'Evernote',
                            'Dropbox'                        
                        ]
                    }

                ]
            },

            {
                title: '统一框架提供Oauth服务',
                img: '/static/ppmessage/img/feature_open.png',
                features: [
                    {
                        subTitle: '统一的框架提供OAuth服务，方便集成',
                        subFeatures: [
                            '集成与B2B2C电子商务平台'      
                        ]
                    }
                ]
            },

            {
                title: '真正的智能',
                img: '/static/ppmessage/img/feature_open.png',
                features: [
                    {
                        subTitle: '不断成长的人工智能',
                        subFeatures: [
                            '可以通过座席与客户之间对话不断学习'      
                        ]
                    },
                    {
                        subTitle: '自动智能应答',
                        subFeatures: [
                            '通过学习座席与客户之间的会话',
                            '通过学习知识库'
                        ]
                    },
                    {
                        subTitle: '快速人工转接',
                        subFeatures: [
                            '通过学习座席与客户直接的会话',
                            '通过学习用户使用的行为'
                        ]
                    }
                ]
            },

            {
                title: '移动优先',
                img: '/static/ppmessage/img/feature_open.png',
                features: [
                    {
                        subTitle: '信息推送',
                        subFeatures: [
                            'Android （MQTT，GCM）',
                            'iOS （APNS）',
                            'Windows （Windows Push）'
                        ]
                    },
                    {
                        subTitle: '信息同步',
                        subFeatures: [
                            'Web同步到移动端'
                        ]
                    },
                    '响应式设计PPMessage用户端'
                ]
            },

            {
                title: '数据分析',
                img: '/static/ppmessage/img/feature_open.png',
                features: [
                    '客户问题数据',
                    '客户行为数据',
                    '开放API',
                    '在线分析',
                    '离线分析'
                ]
            },

            {
                title: '座席分组',
                img: '/static/ppmessage/img/feature_open.png',
                features: [
                    '分组算法',
                    '消息分流'
                ]
            },

            {
                title: '从1到无穷大',
                img: '/static/ppmessage/img/feature_open.png',
                features: [
                    '可集中部署',
                    '可分布部署',
                    '可支持小型系统',
                    '亦可支持超大系统'
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
                $( this ).attr( 'src', feature.img );
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

module.exports = {
    
    buildCssPath: "www/build/css",
    buildScriptPath: "www/build/js",

    ppmessageTemplates: "www/templates/*/*.html",
    
    ppmessageScripts: [

        // Module
        "www/js/module.js",
        "www/js/starter.js",
        "www/js/routers.js",
        "www/js/i18n.js",
        "www/build/templates.js",
        "www/js/app.js",

        // Service
        "www/js/services/constants.js",
        "www/js/services/log.js",
        "www/js/services/ssl.js",
        "www/js/services/file.js",
        "www/js/services/alert.js",
        "www/js/services/api.js",
        "www/js/services/type.js",
        "www/js/services/sqldb.js",
        "www/js/services/notification.js",
        "www/js/services/user.js",
        "www/js/services/send.js",
        "www/js/services/message.js",
        "www/js/services/peer.js",
        "www/js/services/sys.js",
        "www/js/services/mime.js",
        "www/js/services/uploader.js",
        "www/js/services/login.js",
        "www/js/services/nav.js",
        "www/js/services/link.js",
        "www/js/services/localization.js",
        "www/js/services/filechooser.js",
        "www/js/services/delegate.js",
        "www/js/services/updater.js",
        "www/js/services/object.js",
        "www/js/services/contact.js",
        "www/js/services/conversation.js",
        "www/js/services/base.js",
        "www/js/services/main.js",

        "www/js/services/monitor.js",
        
        // DIRECTIVE: CHAT-MESSAGE
        "www/js/directives/message.js",
        "www/js/directives/text-message.js",
        "www/js/directives/txt-message.js",
        "www/js/directives/file-message.js",
        "www/js/directives/image-message.js",
        "www/js/directives/audio-message.js",        
        "www/js/directives/double-click.js",
        "www/js/directives/click.js",

        // DIRECTIVE: CHAT-TOOL OLD STYLE
        "www/js/directives/chat-tool.js",
        "www/js/directives/adding-button.js",
        "www/js/directives/big-mic-button.js",
        "www/js/directives/recording-status.js",
        "www/js/directives/dynamic-height.js",

        // DIRECTIVE: CHAT-TOOL NEW STYLE-->
        "www/js/directives/new-chat-tool.js",

        // DIRECTIVE: HIDE-TABS
        "www/js/directives/hide-tabs.js",
        
        // DIRECTIVE: IMAGE-CROP
        "www/js/directives/crop-image.js",
        "www/js/directives/change-avatar.js",

        // DIRECTIVE: MODAL
        "www/js/directives/image-modal.js",
        "www/js/directives/text-modal.js",
        "www/js/directives/file-chooser-modal.js",
        "www/js/directives/search-modal.js",
        "www/js/directives/conversation-member.js",
        "www/js/directives/add-member-modal.js",
        // "www/js/directives/select-group-user-modal.js",
        "www/js/directives/add-member-by-contact.js",
        "www/js/directives/add-member-by-group.js",
        
        // DIRECTIVE: POPOVER
        "www/js/directives/sidemenu-header.js",
        "www/js/directives/conversation.js",
        "www/js/directives/contact.js",

        "www/js/directives/rightclick.js",
        "www/js/directives/contextmenu-in-list.js",        


        // DIRECTIVE: USERINFOSETTINGS
        "www/js/directives/user-info-modal.js",        

        // CONTROLLER: NOAPP
        "www/js/controllers/noapp.js",
        "www/js/controllers/main-with-logo.js",
        "www/js/controllers/auto-login.js",
        "www/js/controllers/login-error.js",
        "www/js/controllers/login-no-user.js",
        "www/js/controllers/login-with-user.js",
        "www/js/controllers/add-server.js",
        "www/js/controllers/switch-server.js",

        // CONTROLLER: APP
        "www/js/controllers/app.js",

        // CONTROLLER: APP.CONVERSATIONS
        "www/js/controllers/conversation-list.js",
        "www/js/controllers/conversation.js",
        "www/js/controllers/message.js",
        
        // CONTROLLER: APP.CONTACTS
        "www/js/controllers/contact-list.js",
        "www/js/controllers/contact.js",

        // CONTROLLER: APP.SETTINGS
        "www/js/controllers/setting-list.js",
        "www/js/controllers/switch-language.js",
        "www/js/controllers/switch-app.js",
        "www/js/controllers/about.js",
        
        "www/js/controllers/change-avatar.js",
        "www/js/controllers/change-fullname.js",
        "www/js/controllers/change-signature.js",
        "www/js/controllers/push-notification.js",
    ],

    libScripts: [
        "www/lib/jscd.js",
        "www/lib/sha1.js",
        "www/lib/sha1file.js",
        "www/lib/base64.js",
        "www/lib/base64binary.js",
        "www/lib/moment-with-zh-cn-locale.js",
        
        // "bower_components/base64/base64.js",

        // use Jcrop's jquery v1.9.0
        "bower_components/Jcrop/js/jquery.min.js",
        "bower_components/Jcrop/js/Jcrop.js",

        // use ionic's angular v1.4.3
        "bower_components/ionic/js/ionic.bundle.js",
        "bower_components/angular-cookies/angular-cookies.js",        
        "bower_components/angular-translate/angular-translate.js",
        "bower_components/angular-block-ui/dist/angular-block-ui.js",
        "bower_components/angular-file-upload/angular-file-upload.js"
    ],

    ppmessageCss: [
        // use sass to create ionic.app.css & ionic.app.min.css
    ],

    libCss: [
        "www/css/*.css",
        "bower_components/Jcrop/css/Jcrop.css",
        "bower_components/angular-block-ui/dist/angular-block-ui.css"
    ]
};

ppmessageModule.config([
    "$stateProvider",
    "$urlRouterProvider",
function ($stateProvider, $urlRouterProvider) {

    $stateProvider

        .state("noapp", {
            abstract: true,
            controller: "NoAppCtrl",
            url: "/noapp",
            templateUrl: "templates/controllers/noapp.html"
        })

        .state("noapp.login-error", {
            cache: false,
            controller: "LoginErrorCtrl",
            url: "/login-error",
            templateUrl: "templates/controllers/noapp.login-error.html"
        })

        .state("noapp.auto-login", {
            cache: false,
            controller: "AutoLoginCtrl",
            url: "/auto-login/:request_body",
            templateUrl: "templates/controllers/noapp.auto-login.html"
        })

        .state("noapp.main-with-logo", {
            cache: false,
            controller: "MainWithLogoCtrl",
            url: "/main-with-logo",
            templateUrl: "templates/controllers/noapp.main-with-logo.html"
        })

        .state("noapp.login-no-user", {
            controller: "LoginNoUserCtrl",
            url: "/login-no-user",
            templateUrl: "templates/controllers/noapp.login-no-user.html"
        })

        .state("noapp.login-with-user", {
            controller: "LoginWithUserCtrl",
            url: "/login-with-user/",
            templateUrl: "templates/controllers/noapp.login-with-user.html",
            params: {email: null, fullname: null, icon: null}
        })

        .state("noapp.switch-server", {
            cache: false,
            controller: "SwitchServerCtrl",
            url: "/switch-server",
            templateUrl: "templates/controllers/noapp.switch-server.html"
        })

        .state("noapp.add-server", {
            controller: "AddServerCtrl",
            url: "/add-server",
            templateUrl: "templates/controllers/noapp.add-server.html"
        })

    /* Routers for Web app begin */

        .state("app", {
            abstract: true,
            url: "/app",
            templateUrl: "templates/controllers/app.html",
            controller: "AppCtrl"
        })

        .state("app.conversation-list", {
            url: "/conversation-list",
            views: {
                "app-conversation-list": {
                    templateUrl: "templates/controllers/app.conversation-list.html",
                    controller: "ConversationListCtrl"
                },
                "side-menu-content": {
                    templateUrl: "templates/controllers/app.conversation.html",
                    controller: "ConversationCtrl"
                }
            },
            params: {conv_uuid: null, conv_type: null, conv_name: null}
        })

        .state("app.contact-list", {
            url: "/contact-list",
            views: {
                "app-contact-list": {
                    templateUrl: "templates/controllers/app.contact-list.html",
                    controller: "ContactListCtrl"
                },
                "side-menu-content": {
                    templateUrl: "templates/controllers/app.contact.html",
                    controller: "ContactCtrl"
                }
            },
            params: {contact_uuid: null}
        })


        .state("app.setting-list", {
            url: "/setting-list",
            views: {
                "app-setting-list": {
                    templateUrl: "templates/controllers/app.setting-list.html",
                    controller: "SettingListCtrl"
                },
                "side-menu-content": {
                    templateUrl: "templates/controllers/app.blank-setting.html",
                }
            }
        })

        .state("app.change-avatar", {
            url: "/change-avatar",
            views: {
                "app-setting-list": {
                    templateUrl: "templates/controllers/app.setting-list.html",
                    controller: "SettingListCtrl"
                },
                "side-menu-content": {
                    templateUrl: "templates/controllers/app.change-avatar.html",
                    controller: "ChangeAvatarCtrl"
                }
            }
        })

        .state("app.change-password", {
            url: "/change-password",
            views: {
                "app-setting-list": {
                    templateUrl: "templates/controllers/app.setting-list.html",
                    controller: "SettingListCtrl"
                },
                "side-menu-content": {
                    templateUrl: "templates/controllers/app.change-password.html",
                    controller: "ChangePasswordCtrl"
                }
            }
        })


        .state("app.change-fullname", {
            url: "/change-fullname",
            views: {
                "app-setting-list": {
                    templateUrl: "templates/controllers/app.setting-list.html",
                    controller: "SettingListCtrl"
                },
                "side-menu-content": {
                    templateUrl: "templates/controllers/app.change-fullname.html",
                    controller: "ChangeFullnameCtrl"
                }
            }
        })

        .state("app.change-signature", {
            url: "/change-signature",
            views: {
                "app-setting-list": {
                    templateUrl: "templates/controllers/app.setting-list.html",
                    controller: "SettingListCtrl"
                },
                "side-menu-content": {
                    templateUrl: "templates/controllers/app.change-signature.html",
                    controller: "ChangeSignatureCtrl"
                }
            }
        })

        .state("app.push-notification", {
            url: "/push-notification",
            views: {
                "app-setting-list": {
                    templateUrl: "templates/controllers/app.setting-list.html",
                    controller: "SettingListCtrl"
                },
                "side-menu-content": {
                    templateUrl: "templates/controllers/app.push-notification.html",
                    controller: "PushNotificationCtrl"
                }
            }
        })
        
        .state("app.switch-language", {
            url: "/switch-language",
            views: {
                "app-setting-list": {
                    templateUrl: "templates/controllers/app.setting-list.html",
                    controller: "SettingListCtrl"
                },
                "side-menu-content": {
                    templateUrl: "templates/controllers/app.switch-language.html",
                    controller: "SwitchLanguageCtrl"
                }
            }
        })

        .state("app.switch-app", {
            url: "/switch-app",
            views: {
                "app-setting-list": {
                    templateUrl: "templates/controllers/app.setting-list.html",
                    controller: "SettingListCtrl"
                },
                "side-menu-content": {
                    templateUrl: "templates/controllers/app.switch-app.html",
                    controller: "SwitchAppCtrl"
                }
            }
        })

        .state("app.about", {
            cache: false,
            url: "/about",
            views: {
                "app-setting-list": {
                    templateUrl: "templates/controllers/app.setting-list.html",
                    controller: "SettingListCtrl"
                },
                "side-menu-content": {
                    templateUrl: "templates/controllers/app.about.html",
                    controller: "AboutCtrl"
                }
            }
        })

    /* Routers for Web app end */

    /* Routers for Mobile app begin */

        .state("app.conversation-list-mobile", {
            url: "/conversation-list-mobile",
            views: {
                "app-conversation-list": {
                    templateUrl: "templates/controllers/app.conversation-list-mobile.html",
                    controller: "ConversationListCtrl"
                }
            },
            params: {conv_uuid: null, conv_type: null, conv_name: null}
        })

        .state("app.contact-list-mobile", {
            url: "/contact-list-mobile",
            views: {
                "app-contact-list": {
                    templateUrl: "templates/controllers/app.contact-list-mobile.html",
                    controller: "ContactListCtrl"
                }
            },
            params: {contact_uuid: null}
        })


        .state("app.setting-list-mobile", {
            url: "/setting-list-mobile",
            views: {
                "app-setting-list": {
                    templateUrl: "templates/controllers/app.setting-list.html",
                    controller: "SettingListCtrl"
                }
            }
        })

        .state("app.conversation-mobile", {
            url: "/conversation-mobile",
            views: {
                "app-conversation-list": {
                    templateUrl: "templates/controllers/app.conversation.html",
                    controller: "ConversationCtrl"
                }
            },
            params: {conv_uuid: null, conv_type: null, user_uuid: null}
        })

        .state("app.contact-mobile", {
            url: "/contact-mobile",
            views: {
                "app-contact-list": {
                    templateUrl: "templates/controllers/app.contact.html",
                    controller: "ContactCtrl"
                }
            },
            params: {contact_uuid: null}
        })

        .state("app.change-avatar-mobile", {
            url: "/change-avatar-mobile",
            views: {
                "app-setting-list": {
                    templateUrl: "templates/controllers/app.change-avatar.html",
                    controller: "ChangeAvatarCtrl"
                }
            }
        })

        .state("app.change-password-mobile", {
            url: "/change-password-mobile",
            views: {
                "app-setting-list": {
                    templateUrl: "templates/controllers/app.change-password.html",
                    controller: "ChangePasswordCtrl"
                }
            }
        })

        .state("app.change-fullname-mobile", {
            url: "/change-fullname-mobile",
            views: {
                "app-setting-list": {
                    templateUrl: "templates/controllers/app.change-fullname.html",
                    controller: "ChangeFullnameCtrl"
                }
            }
        })

        .state("app.change-signature-mobile", {
            url: "/change-signature-mobile",
            views: {
                "app-setting-list": {
                    templateUrl: "templates/controllers/app.change-signature.html",
                    controller: "ChangeSignatureCtrl"
                }
            }
        })

        .state("app.push-notification-mobile", {
            url: "/push-notification-mobile",
            views: {
                "app-setting-list": {
                    templateUrl: "templates/controllers/app.push-notification.html",
                    controller: "PushNotificationCtrl"
                }
            }
        })
        
        .state("app.switch-language-mobile", {
            url: "/switch-language-mobile",
            views: {
                "app-setting-list": {
                    templateUrl: "templates/controllers/app.switch-language.html",
                    controller: "SwitchLanguageCtrl"
                }
            }
        })

        .state("app.switch-app-mobile", {
            url: "/switch-app-mobile",
            views: {
                "app-setting-list": {
                    templateUrl: "templates/controllers/app.switch-app.html",
                    controller: "SwitchAppCtrl"
                }
            }
        })

        .state("app.about-mobile", {
            url: "/about-mobile",
            views: {
                "app-setting-list": {
                    templateUrl: "templates/controllers/app.about.html",
                    controller: "AboutCtrl"
                }
            }
        });

    $urlRouterProvider.otherwise("/noapp/main-with-logo");

}]);

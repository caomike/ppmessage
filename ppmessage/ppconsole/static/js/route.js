angular.module("this_app.route", ["ui.router", "this_app.constants"])

    .config(function($stateProvider, $urlRouterProvider, yvConstants, blockUIConfig) {
        blockUIConfig.autoInjectBodyBlock = false;

        $stateProvider

            .state("forget", {
                url: "/forget",
                templateUrl: yvConstants.STATIC_PREFIX + "html/forget.html",
                controller: "ForgetCtrl"
            })

            .state("app", {
                abstract: true,
                url: "/app",
                templateUrl: yvConstants.STATIC_PREFIX + "html/app.html",
                controller: "AppCtrl"
            })

            .state("app.signin", {
                url: "/signin/:return_state",
                templateUrl: yvConstants.STATIC_PREFIX + "html/login.html",
                controller: "LoginCtrl"
            })

            .state("app.signup", {
                url: "/signup",
                templateUrl: yvConstants.STATIC_PREFIX + "html/signup.html",
                controller: "SignupCtrl"
            })

            .state("app.createteam", {
                url: "/createteam",
                templateUrl: yvConstants.STATIC_PREFIX + "html/createteam.html",
                controller: "CreateTeamCtrl"
            })

            .state("app.startteam", {
                url: "/startteam",
                templateUrl: yvConstants.STATIC_PREFIX + "html/startteam.html",
                controller: "StartTeamCtrl"
            })

            .state("app.error", {
                url: "/error",
                templateUrl: yvConstants.STATIC_PREFIX + "html/404.html",
                controller: "ErrorCtrl"
            })

            .state("app.checkinbox", {
                url: "/checkinbox/:email",
                templateUrl: yvConstants.STATIC_PREFIX + "html/checkinbox.html",
                controller: "CheckInboxCtrl"
            })

            .state("app.createaccount", {
                url: "/createaccount/:account",
                templateUrl: yvConstants.STATIC_PREFIX + "html/createaccount.html",
                controller: "CreateAccountCtrl"
            })

            .state("app.recoverpassword", {
                url: "/recoverpassword/:account",
                templateUrl: yvConstants.STATIC_PREFIX + "html/recoverpassword.html",
                controller: "RecoverPasswordCtrl"
            })

            .state("app.policy", {
                abstract: true,
                url: "/policy",
                templateUrl: yvConstants.STATIC_PREFIX + "html/policy/policy.html",
                controller: "PolicyCtrl"
            })

            .state("app.policy.termofservice", {
                url: "/termofservice",
                templateUrl: yvConstants.STATIC_PREFIX + "html/policy/termofservice.html",
                controller: "TermOfServiceCtrl"
            })

            .state("app.policy.privacypolicy", {
                url: "/privacypolicy",
                templateUrl: yvConstants.STATIC_PREFIX + "html/policy/privacypolicy.html",
                controller: "PrivacyPolicyCtrl"
            })

             .state("app.resetpassword", {
                url: "/resetpassword/:email",
                templateUrl: yvConstants.STATIC_PREFIX + "html/settings/resetpassword.html",
                controller: "SettingsResetpasswordCtrl"
            })

             .state("app.confirmreset", {
                url: "/confirmreset",
                templateUrl: yvConstants.STATIC_PREFIX + "html/settings/confirmreset.html",
                controller: "SettingsConfirmresetCtrl"
            })

            .state("app.settings.teamprofile", {
                url: "/teamprofile",
                templateUrl: yvConstants.STATIC_PREFIX + "html/settings/teamprofile.html",
                controller: "ApplicationProfileCtrl"
            })

            .state("app.settings.configuration", {
                url: "/configuration",
                templateUrl: yvConstants.STATIC_PREFIX + "html/settings/welcome.html",
                controller: "ApplicationWelcomeCtrl"
            })

            .state("app.settings.teamgrouping", {
                url: "/teamgrouping",
                templateUrl: yvConstants.STATIC_PREFIX + "html/settings/grouping.html",
                controller: "GroupingCtrl"
            })

            .state("app.glance", {
                url: "/glance",
                templateUrl: yvConstants.STATIC_PREFIX + "html/settings/glance.html",
                controller: "GlanceCtrl"
            })
        
            .state("app.settings.teampeople", {
                url: "/teampeople",
                templateUrl: yvConstants.STATIC_PREFIX + "html/settings/people.html",
                controller: "ApplicationPeopleCtrl"
            })

            .state("app.settings.messageroute", {
                url: "/messageroute",
                templateUrl: yvConstants.STATIC_PREFIX + "html/settings/messageroute.html",
                controller: "ApplicationMessageRouteCtrl"
            })

            .state("app.settings.teamstatistics", {
                url: "/teamstatistics",
                templateUrl: yvConstants.STATIC_PREFIX + "html/settings/statistics.html",
                controller: "ApplicationStatisticsCtrl"
            })

            .state("app.settings.overview", {
                url: "/overview",
                templateUrl: yvConstants.STATIC_PREFIX + "html/settings/overview.html",
                controller: "StatisticsOverviewCtrl"
            })

            .state("app.settings.historymessage", {
                url: "/historymessage",
                templateUrl: yvConstants.STATIC_PREFIX + "html/settings/historymessage.html",
                controller: "StatisticsHistoryMessageCtrl"
            })

            .state("app.settings.integrate", {
                url: "/integrate",
                templateUrl: yvConstants.STATIC_PREFIX + "html/settings/integrate.html",
                controller: "IntegrateCtrl"
            })

            .state("app.settings", {
                abstract: true,
                url: "/settings",
                templateUrl: yvConstants.STATIC_PREFIX + "html/settings/settings.html",
                controller: "SettingsCtrl"
            })

            .state("app.settings.profile", {
                url: "/profile",
                templateUrl: yvConstants.STATIC_PREFIX + "html/settings/profile.html",
                controller: "SettingsProfileCtrl"
            })

            .state("app.settings.account", {
                url: "/account",
                templateUrl: yvConstants.STATIC_PREFIX + "html/settings/account.html",
                controller: "SettingsAccountCtrl"
            })

            .state("app.settings.createteam", {
                url: "/createteam",
                templateUrl: yvConstants.STATIC_PREFIX + "html/settings/createapplication.html",
                controller: "SettingsCreateAppCtrl"
            });

        $urlRouterProvider.otherwise("/app/signin/");

    });

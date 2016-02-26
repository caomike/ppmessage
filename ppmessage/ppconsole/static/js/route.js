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

            .state("app.jobs", {
                url: "/jobs",
                templateUrl: yvConstants.STATIC_PREFIX + "html/jobs.html",
                controller: "JobsCtrl"
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

            .state("app.blog", {
                url: "/blog",
                templateUrl: yvConstants.STATIC_PREFIX + "html/app.blog.html",
                controller: "BlogCtrl"
            })

            .state("app.main", {
                url: "/main",
                templateUrl: yvConstants.STATIC_PREFIX + "html/main.html",
                controller: "MainCtrl"
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
                templateUrl: yvConstants.STATIC_PREFIX + "html/application/profile.html",
                controller: "ApplicationProfileCtrl"
            })

            .state("app.settings.configuration", {
                url: "/configuration",
                templateUrl: yvConstants.STATIC_PREFIX + "html/application/welcome.html",
                controller: "ApplicationWelcomeCtrl"
            })

            .state("app.settings.teamgrouping", {
                url: "/teamgrouping",
                templateUrl: yvConstants.STATIC_PREFIX + "html/application/grouping.html",
                controller: "GroupingCtrl"
            })

            .state("app.glance", {
                url: "/glance",
                templateUrl: yvConstants.STATIC_PREFIX + "html/application/glance.html",
                controller: "GlanceCtrl"
            })

            .state("app.settings.teambilling", {
                url: "/teambilling",
                templateUrl: yvConstants.STATIC_PREFIX + "html/application/billing.html",
                controller: "ApplicationBillingCtrl"
            })

            .state("app.settings.teamchooseplan", {
                url: "/teamchooseplan",
                templateUrl: yvConstants.STATIC_PREFIX + "html/application/changeplan.html",
                controller: "ApplicationChangePlanCtrl"
            })

            .state("app.settings.teampeople", {
                url: "/teampeople",
                templateUrl: yvConstants.STATIC_PREFIX + "html/application/people.html",
                controller: "ApplicationPeopleCtrl"
            })

            .state("app.settings.messageroute", {
                url: "/messageroute",
                templateUrl: yvConstants.STATIC_PREFIX + "html/application/messageroute.html",
                controller: "ApplicationMessageRouteCtrl"
            })

            .state("app.settings.robot", {
                url: "/robot",
                templateUrl: yvConstants.STATIC_PREFIX + "html/application/robot.html",
                controller: "ApplicationRobotCtrl"
            })

            .state("app.settings.teamstatistics", {
                url: "/teamstatistics",
                templateUrl: yvConstants.STATIC_PREFIX + "html/application/statistics.html",
                controller: "ApplicationStatisticsCtrl"
            })

            .state("app.settings.overview", {
                url: "/overview",
                templateUrl: yvConstants.STATIC_PREFIX + "html/application/overview.html",
                controller: "StatisticsOverviewCtrl"
            })

            .state("app.settings.historymessage", {
                url: "/historymessage",
                templateUrl: yvConstants.STATIC_PREFIX + "html/application/historymessage.html",
                controller: "StatisticsHistoryMessageCtrl"
            })

            .state("app.settings.integrate", {
                url: "/integrate",
                templateUrl: yvConstants.STATIC_PREFIX + "html/application/integrate.html",
                controller: "IntegrateCtrl"
            })

            .state("app.settings.autoinstall", {
                url: "/autoinstall",
                templateUrl: yvConstants.STATIC_PREFIX + "html/application/autoinstall.html",
                controller: "AutoInstallCtrl"
            })

            .state("app.settings.manualinstall", {
                url: "/manualinstall",
                templateUrl: yvConstants.STATIC_PREFIX + "html/application/manualinstall.html",
                controller: "ManualInstallCtrl"
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
            })

            .state("app.logout", {
                controller: "LogoutCtrl"
            })

             .state("autoinstall", {
                url: "/autoinstall",
                templateUrl: yvConstants.STATIC_PREFIX + "html/ppHelper.html",
                controller: "AutoInstallCtrl"
            });
        $urlRouterProvider.otherwise("/app/main");

    });

ppmessageModule.directive("yvAudioMessage", [
    "$interval",
    "yvType",
    "yvFile",
    "yvSys",
    "yvAPI",
    "yvMain",
    "yvConstants",
    "yvDB",
function ($interval, yvType, yvFile, yvSys, yvAPI, yvMain, yvConstants, yvDB) {

    function link($scope, $element, $attrs, messageCtrl) {

        function setAudioRead() {
            var status = $scope.message.status;

            if (yvType.is_left($scope.message) && status !== yvConstants.RECV_STATUS.RECV_PLAY) {
                yvMain.set_audio_read($scope.message);
            }
        }


        function playAnimation() {
            $scope.playCount += 1;
            $scope.playCount %= 4;
            $scope.play_flag_0 = false;
            $scope.play_flag_1 = false;
            $scope.play_flag_2 = false;
            $scope.play_flag_3 = false;
            $scope["play_flag_" + $scope.playCount] = true;
        }


        function onStopPlayAudio(event) {
            $scope.isPlaying = false;
            if ($scope.playInterval !== null) {
                $interval.cancel($scope.playInterval);
                $scope.playInterval = null;
            }

            $scope.play_flag_0 = false;
            $scope.play_flag_1 = false;
            $scope.play_flag_2 = false;
            $scope.play_flag_3 = true;
        }


        function onStartPlayAudio() {
            $scope.isPlaying = true;
            if ($scope.playInterval === null) {
                $scope.playInterval = $interval(playAnimation, 500);
            }
            setAudioRead();
        }


        function startPlayAudioInBrowser() {
            var audio;

            if ($scope.audio) {
                $scope.audio.play();
                return;
            }

            audio = $element.append("<audio>").find("audio")[0];
            
            if (!audio.canPlayType || audio.canPlayType("audio/mp3") === "") {
                console.error("This browser doesn't support playing audio");
                $element.remove("audio");
                return;
            }

            audio.autoplay = 'autoplay';
            audio.onplay = onStartPlayAudio;
            audio.onended = audio.onerror = audio.onpause = onStopPlayAudio;
            audio.src = yvAPI.get_audio_url($scope.message.file, "mp3");
            $scope.audio = audio;
        }


        function startPlayAudioInMobile() {
            var filePath, audio;

            if ($scope.audio) {
                $scope.audio.play();
                onStartPlayAudio();
                return;
            }

            if (yvSys.in_ios_app()) {
                filePath = "documents://" + $scope.message.file;
            } else if (yvSys.in_android_app()) {
                filePath = yvFile.get_root_dir() + $scope.message.file;
            }

            audio = new Media(filePath, onStopPlayAudio, function (error) {
                console.error(error);
            }, function (playStatus) {
                console.log("===========audio play status: ", playStatus);
            });

            if (!audio) {
                console.error("============New Media() error ?");
                return;
            }

            $scope.audio = audio;
            $scope.audio.play();
            onStartPlayAudio();
        }


        function startPlayAudio() {
            if (yvSys.in_mobile_app()) {
                startPlayAudioInMobile();
                return;
            }
            startPlayAudioInBrowser();
        }


        function stopPlayAudio() {
            if ($scope.audio) {
                // Releases the underlying operating system's audio resources.
                // This is particularly important for Android, since there are
                // a finite amount of OpenCore instances for media playback.
                // Applications should call the release function for any Media
                // resource that is no longer needed.
                if (yvSys.in_mobile_app()) {
                    $scope.audio.stop();
                    $scope.audio.release();
                    return;
                }
                // in browser, audio instance doesn't have stop method.
                $scope.audio.pause();
            }
        }


        // When a user click a audio message, all none-target audio message should be paused.
        // The action performed to target audio message depends on its current status.
        // If it is playing, pause it, otherwise play it.
        $scope.$on("event:toggle-play-audio", function (event, message) {
            if (message !== $scope.message) {
                if ($scope.isPlaying === true) {
                    stopPlayAudio();
                    return;
                }
                return;
            }

            if ($scope.isPlaying === true) {
                stopPlayAudio();
                return;
            }

            startPlayAudio();
            return;
        });


        $scope.$on("event:stop-play-audio", function (event) {
            if ($scope.isPlaying === true) {
                stopPlayAudio();
            }
        });


        $scope.$on("$destory", function (event) {
            if ($scope.isPlaying === true) {
                stopPlayAudio();
            }
        });


        $scope.isAudioUnread = function (message) {
            if (yvType.is_right(message)) {
                return false;
            }
            if (message.status === yvConstants.RECV_STATUS.RECV_PLAY) {
                return false;
            }
            return true;
        }

        $scope.getAudioDuration = function (message) {
            return message.duration + "''";
        };


        $scope.isLeftAudioMessage = function (message) {
            return yvType.is_left_audio(message);
        };


        $scope.isRightAudioMessage = function (message) {
            return yvType.is_right_audio(message);
        };


        $scope.getAudioWidth = function () {
            var width = $scope.message.duration * 0.5 + 100;
            return {"width": width + "px"};
        };


        function setAudio(_audio) {
            $scope.message.file = _audio.fid;
            $scope.message.duration = _audio.dura;
            messageCtrl.scrollBottom();
        }

        function setAudioInMobile(_audio) {
            yvFile.has_file(_audio.fid, function () {
                setAudio(_audio);
            }, function () {
                yvAPI.download_file(_audio.fid, null, function () {
                    setAudio(_audio);
                });
            });
        }

        function init(message) {
            var body = {}, audio = null;
            
            $scope.play_flag_0 = false;
            $scope.play_flag_1 = false;
            $scope.play_flag_2 = false;
            $scope.play_flag_3 = true;

            $scope.audio = null;
            $scope.isPlaying = false;
            $scope.playInterval = null;
            $scope.playCount = -1;
            
            if (message.file && message.duration) {
                messageCtrl.scrollBottom();
                return;
            }
            
            if (message.body) {
                body = angular.fromJson(message.body);
            }

            if (yvSys.in_ios_app()) {
                audio = body.m4a;
                setAudioInMobile(audio);
                message.mime = "audio/m4a";
                return;
            }

            if (yvSys.in_android_app()) {
                audio = body.amr;
                setAudioInMobile(audio);
                message.mime = "audio/amr";
                return;
            }

            audio = body.mp3;
            setAudio(audio);
            message.mime = "audio/mp3";
            return;
        }

        init($scope.message);
    }

    return {
        restrict: "E",
        replace: true,
        require: "^yvMessage",
        scope: {
            message: "="
        },
        link: link,
        templateUrl: "templates/directives/audio-message.html"
    };

}]);

// fixme: fix this directive when use card message

ppmessageModule.directive("yvCardMessage", [
    "yvDelegate",
function (yvDelegate) {

    function link($scope, $element, $attr) {

        function _getSingleCardInChat(card_id) {
            var defer = $q.defer();
            yvDB.query_single_card(card_id, function (card) {
                defer.resolve(card);
            });
            return defer.promise;
        }

        
        function _getSingleCardInHistory(raw_card) {
            var card = {},
                defer = $q.defer(),
                cover_uuid = raw_card.cover_file_uuid,
                cover_file = cover_uuid + ".jpeg";

            function __setCard(card, raw_card, cover_file, defer) {
                card.content_server_uuid = raw_card.content_file_uuid;
                card.cover_local_file = cover_file;
                defer.resolve(card);
            }

            card.title = raw_card.title;
            card.abstract = raw_card.abstract;

            if (yvSys.in_mobile_app()) {
                yvFile.has_file(cover_file, function () {
                    __setCard(card, raw_card, cover_file, defer);
                }, function () {
                    yvAPI.download_file(cover_uuid, null, function () {
                        __setCard(card, raw_card, cover_file, defer);
                    });
                });
            } else {
                card.content_server_uuid = raw_card.content_file_uuid;
                card.cover_server_uuid = raw_card.cover_file_uuid;
                defer.resolve(card);
            }

            return defer.promise;
        }

        
        function _download() {
            var _body;

            if (yvType.is_single_card($scope.message)) {
                _body = JSON.parse($scope.message.body);
                yvAPI.get_single_card(_body.uuid, function (raw_card) {
                    _getSingleCardInHistory(raw_card).then(function (card) {
                        $scope.single_card = card;
                    });
                });
                return;
            }

            if (yvType.is_multiple_card($scope.message)) {
                $scope.sub_cards = [];
                _body = JSON.parse($scope.message.body);
                yvAPI.get_multiple_card(_body.uuid, function (res) {
                    angular.forEach(res.body, function (card_uuid, index) {
                        _getSingleCardInHistory(res.card[card_uuid]).then(function (card) {
                            if (index === 0) {
                                $scope.caption_card = card;
                            } else {
                                $scope.sub_cards.push(card);
                            }
                        });
                    });
                });
            }

        }

        
        function _load() {
            var card_list;

            if (yvType.is_single_card($scope.message)) {
                _getSingleCardInChat($scope.message.card).then(function (card) {
                    $scope.single_card = card;
                });
                return;
            }

            if (yvType.is_multiple_card($scope.message)) {
                card_list = JSON.parse($scope.message.card);
                $scope.sub_cards = [];
                angular.forEach(card_list, function (card_id, index) {
                    _getSingleCardInChat(card_id).then(function (card) {
                        if (index === 0) {
                            $scope.caption_card = card;
                        } else {
                            $scope.sub_cards.push(card);
                        }
                    });
                });
                return;
            }
        }


        $scope.isSingleCardMessage = function (message) {
            return yvType.is_single_card(message);
        };

        
        $scope.isMultipleCardMessage = function (message) {
            return yvType.is_multiple_card(message);
        };

        
        $scope.viewCard = function (card) {
            var _uuid, _content_file, _content_url;
            
            function __readCardContent(_content_url, card) {
                yvFile.read_as_text(_content_url, function (data) {
                    card.content = $sce.trustAsHtml(data);
                    $scope.$parent.showCardModal(card.content);
                });
            }

            if (!card) {
                return;
            }

            if (yvSys.in_mobile_app()) {
                if (card.content) {
                    $scope.$parent.showCardModal(card.content);
                    return;
                }

                if (card.content_local_file) {
                    _content_url = yvFile.get_root_dir() + card.content_local_file;
                    __readCardContent(_content_url, card);
                    return;
                }

                if (card.content_server_uuid) {

                    // in history message-thread
                    _uuid = card.content_server_uuid;
                    _content_url = yvFile.get_root_dir() + _uuid;
                    yvFile.has_file(_uuid, function (file) {
                        __readCardContent(file.nativeURL, card);
                    }, function () {
                        yvAPI.download_file(_uuid, null, function (file) {
                            card.content_local_file = _uuid;
                            __readCardContent(file.nativeURL, card);
                        });
                    });
                }
            } else {
                _uuid = card.content_server_uuid;

                if (!_uuid) {
                    return;
                }
                if (card.content) {
                    $scope.$parent.showCardModal(card.content);
                    return;
                }
                yvAPI.download_card_content(_uuid).success(function (data) {
                    card.content = $sce.trustAsHtml(data);
                    $scope.$parent.showCardModal(card.content);
                });
            }
        };


        $scope.getCardTitle = function (card) {
            if (card && card.title) {
                return card.title;
            }
            return "";
        };


        $scope.getCardAbstract = function (card) {
            if (card && card.abstract) {
                return card.abstract;
            }
            return "";
        };

        
        $scope.getCardCover = function (card) {
            return yvLink.get_card_cover(card);
        };

        
        $scope.getCardStyle = function (message) {
            var margin = "20%";
            if (yvSys.in_mobile_app()) {
                margin = "5%";
            }
            return {
                "clear": "both",
                "margin-bottom": "30px",
                "Margin-Left": margin,
                "margin-right": margin
            };
        };

        
        $scope.getSubCardStyle = function (is_last) {
            if (is_last) {
                return {"border-radius": "0 0 10px 10px"};
            }
            return {};
        };

        
        function _init() {            
            if ($scope.message.history) {
                _download();
            } else {
                _load();
            }
        }

        _init();
    }
    
    return {
        restrict: "E",
        scope: {
            message: "=",
            isLast: "="
        },
        replace: true,
        templateUrl: "templates/directives/card-message.html",
        link: link
    };
    
}]);

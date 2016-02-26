angular.module("this_app")
	.controller("AutoInstallCtrl", function($scope, $rootScope, $stateParams, $cookies, $state, $timeout, $http, $translate, yvTransTags, yvAjax, yvUtil, yvUser, yvConstants, yvDebug) {

        $scope.go_back_integrate = function() {
            $state.go("app.settings.integrate");
        };
                
        var _team = function() {
            var _own_team = yvUser.get_team();
            if (_own_team == null) {
                console.error("no team info");
                return;
            }
            $scope.pp.ppkey = _own_team.app_key;
			$scope.pp.ppsecret = _own_team.app_secret;
        };
        
        var _logined = function() {
            if(yvUser.get_status() != "OWNER_2") {
                console.error("should not be here");
                return;
            };
            if(!yvUser.get_team()) {
                var _get = yvAjax.get_app_owned_by_user(yvUser.get_uuid());
                _get.success(function(data) {
                    yvUser.set_team(data.app);
                    _team();
                });
            } else {
                _team();
            }
        };

        var _translate = function() {
            var _tag_list = [];
            for (var i in yvTransTags.en.application.profile) {
                var _t = "application.profile." + i;
                _tag_list.push(_t);
            };
            $scope.translate = function() {
            };
            yvUtil.translate($scope, 'lang', _tag_list, $scope.translate);
        };

        
		var _init = function() {
            $scope.alert_hide = true;
      		$scope.cut_hide = true;
      		$scope.autoInstall_hide = true;
      		$scope.bg_load_catalog = false;
      		$scope.tg_load_catalog = false;
      		$scope.install_disabled = false;
      		$scope.serverlist = [];
      		$scope.paths = [];
			$scope.selectall_checked = false;
      		$scope.form_disabled = false;
      		$scope.cut_disabled = false;

            //init the ppkey and ppsecret.
			$scope.pp = {
				login_type: "FTP",
				ppkey: null,
				ppsecret: null,
			};

            _translate();
            yvAjax.check_logined(_logined, null);
        };
		
		_init();

        $scope.get_embedded_code = function() {
            return _embedded_code;
        };
        
		//for the help.
		$scope.go_to_introduce = function() {
			$state.go('app.docs.web');
		};

		//submit the form to server and get the return.
    	$scope.submit = function() {
    		$scope.alert_hide = true;

    		//if the params are valid.
    		if($scope.ppParams.$valid) {
  				//show the alert information and add the css class.
        		$scope.alert_hide = false;
        		$scope.danger_show = false;
        		$scope.warning_show = false;
        		$scope.info_show = true;
        		$scope.alert_information = "请等待...";

        		//disable the sub button and form to ban the resubmit.
        		$scope.sub_disabled = true;
        		$scope.form_disabled = true;
                
        		//send the ajax.
        		$http({
        			cache: false,
        			method: 'POST',
        			url: '/portal/ajax_autoinstall_web/',
        			data: {
        				'host' : $scope.pp.host,
        				'user' : $scope.pp.user,
        				'pwd'  : $scope.pp.pwd,
        				'ppkey'   : $scope.pp.ppkey,
        				'ppsecret': $scope.pp.ppsecret,
        				'login_type': $scope.pp.login_type,
        				'type': 'login',
        			}
        		}).then(function successCallback(response) {
        			var tmp = response.data;

      				// the return has 3 part:
      				// info : return whether the process has success or not.
      				// path : return the server path.(maybe null under windows and ssh)
      				// list : return the server file and dir list.
      				if(tmp['info'] == "succeed") {

      					//if succeed, hide the alert information and show the init path and list.
      					$scope.info_show = false;
      					$scope.alert_hide = true;
      					$scope.cut_hide = false;
      					$scope.autoInstall_hide = false;

      					//if the init path is not null, record the init path.
      					if(tmp['path'] != '') {
      						$('#init-path').text(tmp['path']);
      					}
      					$scope.updatecatalog(tmp['list']);

      				} else {

      					//if failed, show the error information and change the css class.
      					//the form should be editable.
      					$scope.alert_information = tmp['info'];
      					$scope.info_show = false;
      					$scope.danger_show = true;
      					$scope.sub_disabled = false;
      					$scope.form_disabled = false;
      				}
      			}, function errorCallback(data) {

      				//not connectted.
      				//the form should be editable.
      				$scope.alert_information = "网络链接错误，请稍后重试";
      				$scope.info_show = false;
      				$scope.warning_show = true;
      				$scope.sub_disabled = false;
      				$scope.form_disabled = false;
      			});
      		} else {
      			//the form is invalid. show the alerts.
      			$scope.ppParams.submitted = true;
      		}
    	};

      	//cut off the link.
      	$scope.cut = function() {

      		//clear the data in model. key and secret shouldn't be clear.
      		$scope.pp.host = "";
      		$scope.pp.user = "";
      		$scope.pp.pwd = "";

      		//clear the init path. hide the autoinstall window.
      		$("#init-path").text("");
      		$scope.paths = [];
      		$scope.autoInstall_hide = true;
      		$scope.sub_disabled = false;
      		$scope.cut_hide = true;
      		$scope.form_disabled = false;
      		$scope.ppParams.submitted = false;
      	};

      	//back to the parrent dir.
      	$scope.back = function() {
      		if($scope.paths.length > 0) {
      			var tmppath = $scope.paths.pop();
      			$scope.changecatalog("push", tmppath);
      		}
      	};

      	//get the current path.
      	$scope.getPath = function() {
      		var path = "";
      		if($scope.paths.length > 0) {
      			path = $("#init-path").text();
      			if(path == '/') {
      				path = "";
      			}
      			for(i in $scope.paths) {
      				if(path != "") {
      					path += '/';
      				}
      				path += $scope.paths[i];
      			}
      		}
      		return path;
      	};

      	//change the catalog when click the dir.
      	$scope.list_li_click = function(event, item) {
      		if(item.isDir) {
      			if(event.target.getAttribute("role") != "input") {
      				$scope.paths.push(item.name);
      				$scope.changecatalog("pop", item.name);
      			}
      		}
      	};

      	//change the catalog.
      	$scope.changecatalog = function(q_type, subpath) {
      		//get the current path;
      		var curpath = {};
      		curpath.path = $scope.getPath();
      		curpath.type = "catalog";
      		curpath.host = $scope.pp.host;
      		curpath.user = $scope.pp.user;
      		curpath.pwd = $scope.pp.pwd;
      		curpath.login_type = $scope.pp.login_type;
      		curpath.ppkey = $scope.pp.ppkey;
      		curpath.ppsecret = $scope.pp.ppsecret;

      		//when ajaxing, the install button should be disabled.
      		function changedisabled() {
      			$scope.bg_load_catalog = !$scope.bg_load_catalog;
      			$scope.tg_load_catalog = !$scope.tg_load_catalog;
      			$scope.install_disabled = !$scope.install_disabled;

      			//the cut button should be disabled. for the ajax is asynchronous.
      			$scope.cut_disabled = !$scope.cut_disabled;
      		}

      		//the shadow bg should be
      		$("#load-catalog").css("height", $(".panel-body .list-group")[0].scrollHeight);
      		changedisabled();

      		//send the ajax
      		//this is Asynchronous!!!!!
      		$http({
      			cache: false,
      			method: 'POST',
      			url: '/portal/ajax_autoinstall_web/',
      			data: JSON.stringify(curpath),
      		}).then(function successCallback(response) {
      			$scope.updatecatalog(response.data);
      			changedisabled();
      		}, function errorCallback(data) {
      			alert("网络连接错误，请稍后重试！");
      			changedisabled();

      			//this situation occurs when the FTP server is closed.
      			//if error occured, the paths should back to the status before.
      			//cause there are two type to use this function:list_li_click, back
      			//if list_li_click failed, pop the last subpath.
      			//if back failed, push the last subpath.
      			if(q_type == "pop") {
      				$scope.paths.pop();
      			} else {
      				$scope.paths.push(subpath);
      			}
      		});
      	};

      	//update the catalog.
      	$scope.updatecatalog = function(data) {
      		$scope.selectall_checked = false;
      		var tmplist = [];
      		var tmp = {};

      		//put the dirs and files into serverlist.
      		for(i in data['dirList']) {
      			tmp = {};
      			tmp.select = false;
      			tmp.name = data['dirList'][i];
      			tmp.isDir = true;
      			tmp.isFile = false;
      			tmplist.push(tmp);
      		}
      		for(i in data['fileList']) {
      			tmp = {};
      			tmp.select = false;
      			tmp.name = data['fileList'][i];
      			tmp.isFile = true;
      			tmp.isDir = false;
      			tmplist.push(tmp);
      		}
      		$scope.serverlist = tmplist;
      	};

      	//select all the item to install.
        $scope.selectAll = function() {
          $scope.serverlist.forEach(function(val) {
            val.select = $scope.selectall_checked;
          });
        }


      	//select the sub items to install. the checkbox should influence the selectAll
      	$scope.pitch = function() {
      		var flag = true;

      		//if one of the items is not select, the selectall should be diselected.
      		for(i in $scope.serverlist) {
      			if($scope.serverlist[i].select == false) {
      				flag = false;
      				break;
      			}
      		}
      		$scope.selectall_checked = flag;
      	};

      	//get the install list.
      	$scope.getList = function() {
      		var filelist = [];
      		var dirlist = [];

      		//push the items in different tuple.
      		for(i in $scope.serverlist) {
      			if($scope.serverlist[i].select) {
      				if($scope.serverlist[i].isDir) dirlist.push($scope.serverlist[i].name);
      				else filelist.push($scope.serverlist[i].name);
      			}
      		}

      		var ret = {};
      		ret.fileList = filelist;
      		ret.dirList = dirlist;
      		ret.path = $scope.getPath();
      		ret.type = "install";
      		ret.host = $scope.pp.host;
      		ret.user = $scope.pp.user;
      		ret.pwd = $scope.pp.pwd;
      		ret.login_type = $scope.pp.login_type;
      		ret.ppkey = $scope.pp.ppkey;
      		ret.ppsecret = $scope.pp.ppsecret;
      		return ret;
      	};

      	//install the scripts.
      	$scope.install = function() {
      		//get the install list.;
      		var selectlist = $scope.getList();

      		//if no files selected.
      		if(selectlist['fileList'].length == 0 && selectlist['dirList'].length == 0) {
      			alert("请选择文件或文件夹后再进行安装！");
      		} else {

      			//change the shadow background.
      			$scope.bg_window_show = !$scope.bg_window_show;
      			$("#waiting-dialog").modal({show:true});

      			$http({
      				cache: false,
      				method: 'POST',
      				url: "/portal/ajax_autoinstall_web/",
      				data: JSON.stringify(selectlist)
      			}).then(function successCallback(response) {      				
              var tmp = response.data;
      				if(tmp['info'] == 0) {
      					alert("安装完成！");
      					$scope.bg_window_show = !$scope.bg_window_show;
      				} else {
      					alert("安装程序出了一些小错误，请稍后重试！");
      					$scope.bg_window_show = !$scope.bg_window_show;
      				}
              $("#waiting-dialog").modal('hide');    			
            }, function errorCallback(data) {
      				alert("网络链接错误，请稍后重试！");
      				$scope.bg_window_show = !$scope.bg_window_show;
      				$("#waiting-dialog").modal('hide');
      			});



      		}
      	};
	}); // end ctrl

angular.module("this_app", [])
.controller("AutoinstallCtrl", function($scope, $http) {

	var submitForm = function() {
			$scope.alert_hide = true;

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

          ajax_data = {
            host      : $scope.pp.host,
            user      : $scope.pp.user,
            pwd       : $scope.pp.pwd,
            ppkey     : $scope.pp.ppkey,
            ppsecret  : $scope.pp.ppsecret,
            login_type: $scope.pp.login_type,
            type      : 'login',        
          };

	    		ajax_AutoInstall(ajax_data, submitFormSuccessCB, submitFormErrorCB);

	    	} else {
      			//the form is invalid. show the alerts.
      			$scope.ppParams.submitted = true;
	    	}
        },

        submitFormSuccessCB = function(response) {
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
				updateCatalog(tmp['list']);

			} else {
				//if failed, show the error information and change the css class.
				//the form should be editable.
				$scope.alert_information = tmp['info'];
				$scope.info_show = false;
				$scope.danger_show = true;
				$scope.sub_disabled = false;
				$scope.form_disabled = false;
			}
  		},

  		submitFormErrorCB = function(data) {
			//not connectted.
			//the form should be editable.
			$scope.alert_information = "网络链接错误，请稍后重试";
			$scope.info_show = false;
			$scope.warning_show = true;
			$scope.sub_disabled = false;
			$scope.form_disabled = false;  			
  		},

		ajax_AutoInstall = function(_data, successCB, errorCB) {
			$http({
				cache: false,
				method: 'POST',
				url: '/portal/ajax_autoinstall_web/',
				data: _data,
			}).then(successCB, 
				errorCB);
		},

		cutOffLink = function() {
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
		},

		getPath = function() {
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
		},

		changedisabled = function() {
      		//when ajaxing, the install button should be disabled.
  			$scope.bg_load_catalog = !$scope.bg_load_catalog;
  			$scope.tg_load_catalog = !$scope.tg_load_catalog;
  			$scope.install_disabled = !$scope.install_disabled;

  			//the cut button should be disabled. for the ajax is asynchronous.
  			$scope.cut_disabled = !$scope.cut_disabled;
		},

		changeCatalog = function(q_type, subpath) {
      		//get the current path;
      		var curpath = {
      			path: getPath(),
      			type: "catalog",
      			host: $scope.pp.host,
      			user: $scope.pp.user,
      			pwd: $scope.pp.pwd,
      			login_type: $scope.pp.login_type,
      			ppkey: $scope.pp.ppkey,
      			ppsecret: $scope.pp.ppsecret,
      		};

      		//the shadow bg should be
      		$("#load-catalog").css("height", $(".panel-body .list-group")[0].scrollHeight);
      		changedisabled();

      		ajax_AutoInstall(JSON.stringify(curpath), 
      			changeCatalogSuccessCB, function(error) {
            alert("网络连接错误，请稍后重试！");
            changedisabled();
					restorePath(q_type, subpath);
      			});

		},

		changeCatalogSuccessCB = function(response) {
			updateCatalog(response.data);
			changedisabled();
		},


		restorePath = function(q_type, subpath) {
  			//this situation occurs when the server is closed.
  			//if error occured, the paths should back to the status before.
  			//cause there are two type to use this function:list_li_click, back
  			//if list_li_click failed, pop the last subpath.
  			//if back failed, push the last subpath.
  			if(q_type == "pop") {
  				$scope.paths.pop();
  			} else {
  				$scope.paths.push(subpath);
  			}			
		},

      	//update the catalog.
		updateCatalog = function(data) {
      		$scope.selectall_checked = false;
      		var tmplist = [];
      		var tmp_data = function(val, isDir) {
            this.select = false;
            this.name = val;
            this.isDir = isDir;
            this.isFile = !isDir;
          };

      		//put the dirs and files into serverlist.
      		data['dirList'].forEach(function(val) {
      			tmplist.push(new tmp_data(val, true));
      		});
      		data['fileList'].forEach(function(val) {
      			tmplist.push(new tmp_data(val, false));
      		});

      		$scope.serverlist = tmplist;			
		},

		installToFiles = function(list) {
			if(list['filelist'].length == 0 && list['dirList'].length == 0) {
      			alert('请选择文件或文件夹后再进行安装！');
      			return;
			} else {

      			//change the shadow background.
      			$scope.bg_window_show = !$scope.bg_window_show;
      			$("#waiting-dialog").modal('show');

      			ajax_AutoInstall(JSON.stringify(list), installToFilesSuccessCB, 
      				installToFilesErrorCB);
			}
		},

		installToFilesSuccessCB = function(response) {
			var tmp = response.data;

			if(tmp['info'] == 0) {
				alert("安装完成！");
			} else {
				alert("安装程序出了一些小错误，请稍后重试！");
			}

			$scope.bg_window_show = !$scope.bg_window_show;
			$('#waiting-dialog').modal('hide');
		},

		installToFilesErrorCB = function(data) {
			alert("网络链接错误，请稍后重试！");
			$scope.bg_window_show = !$scope.bg_window_show;
			$("#waiting-dialog").modal('hide');
		},

     	//get the install list.
		getList = function() {
      		var filelist = [];
      		var dirlist = [];

      		//push the items in different tuple.
      		$scope.serverlist.forEach(function(val) {
      			if(val.select) {
      				if(val.isDir) dirlist.push(val.name);
      				else filelist.push(val.name);
      			}
      		});

      		var ret = {
      			fileList: filelist,
      			dirList: dirlist,
      			path: getPath(),
      			type: "install",
      			host: $scope.pp.host,
      			user: $scope.pp.user,
      			pwd: $scope.pp.pwd,
      			login_type: $scope.pp.login_type,
      			ppkey: $scope.pp.ppkey,
      			ppsecret: $scope.pp.ppsecret,
      		};
      		return ret;
		},

		//submit the form to server and get the return.
		$scope.submit = function() {
			submitForm();
		};

      	//cut off the link.
      	$scope.cut = function() {
      		cutOffLink();
      	};

      	//back to the parrent dir.
      	$scope.back = function() {
      		if($scope.paths.length > 0) {
      			var tmppath = $scope.paths.pop();
      			changeCatalog("push", tmppath);
      		}
      	};

      	//select all the item to install.
      	$scope.selectAll = function() {
      		$scope.serverlist.forEach(function(val) {
      			val.select = $scope.selectall_checked;
      		});
      	};

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

      	//install the scripts.
      	$scope.install = function() {
      		var selectlist = getList();
      		installToFiles(selectlist);
      	};

   	});

/**
 *
 * var $uploader = Service.$uploader;
 * 
 * // Upload
 * var uploadId = $uploader.upload({
 *     type: 'file'/'txt',
 *     content: file / 'large text'
 * }).progress(function(percentage) {
 *     // 0 ~ 100
 * }).done(function(response){
 *     // response.fuuid
 * }).fail(function(errorCode){
 *     switch (errorCode) {
 *         // ...
 *     }
 * }).query().uploadId;
 *
 * // Cancel
 * $uploader.cancel(uploadId);
 *
 * // Clear all uploading tasks
 * $uploader.clear();
 *
 */
((function(Service) {

    var Uploader = function() {

        var FILE_UPLOAD_ID_PREFIX = 'file-upload-',
            
            fileUploadPools = {},

            ERROR_CODE = Uploader.ERROR_CODE,

            // Create the XHR object.
            createCORSRequest = function (method, url) {

                var xhr = new XMLHttpRequest();
                if ("withCredentials" in xhr) {
                    // XHR for Chrome/Firefox/Opera/Safari.
                    xhr.open(method, url, true);
                } else if (typeof XDomainRequest != "undefined") {
                    // XDomainRequest for IE.
                    xhr = new XDomainRequest();
                    xhr.open(method, url);
                } else {
                    // CORS not supported.
                    xhr = null;
                }
                return xhr;
            },

            UploadTask = function(settings) {

                var self = this,
                    $json = Service.$json,
                    
                    url = null,
                    type = settings.type, // 'file' / 'txt'
                    uploadId = FILE_UPLOAD_ID_PREFIX + Service.$tools.getUUID(), // file upload id

                    doneCallback = null, // done callback
                    failCallback = null,
                    progressCallback = null,

                    status = {
                        uploadId: uploadId,
                        state: 'RUNNING',
                        progress: 0
                    },

                    fixResponse = function (response) { // Fix response , so let file and txt return the same result

                        var fuuid = null;
                        
                        switch (type) {
                        case 'file':
                            fuuid = $json.parse(response).fuuid;
                            break;

                        case 'txt':
                            fuuid = $json.parse(response).fid;
                            break;
                        }

                        return { fuuid: fuuid };
                    };

                // Store task to task pool
                fileUploadPools[uploadId] = this;

                // choose url
                switch (type) {
                case 'file':
                    url = Configuration.file_upload_url;
                    break;

                case 'txt':
                    url = Configuration.file_upload_txt_url;
                    break;
                }

                var xhr = createCORSRequest("post", url); // create a xhr 

                // A function that is called periodically with information about the progress of the request.
                // NOTE: 'txt' can not add call this method, or it will not working !!!
                if (type == 'file') {
                    xhr.upload.onprogress = function (e) {
                        
                        if (e.lengthComputable) {
                            var percentage = Math.round((e.loaded * 100) / e.total);
                            
                            if (status.state == 'RUNNING') {
                                status.progress = percentage;

                                // progress callback
                                if (progressCallback) progressCallback(percentage);
                            }
                        }
                    };   
                }

                // The function to call when a request encounters an error.
                xhr.onerror = function (e) {
                    if (failCallback) failCallback(ERROR_CODE.SERVICE_NOT_AVALIABLE);
                };

                // The function to call when a request is aborted.
                xhr.onabort = function (e) {
                    if (failCallback) failCallback(ERROR_CODE.CANCEL);
                };

                // The function to call when an HTTP request returns after successfully loading content.
                xhr.onload = function (e) {

                    // Change state to 'FINISH'
                    status.state = 'FINISH';
                    status.progress = 100;
                    
                    if (type == 'txt') $("#pp-composer-container-content-txt").val('');
                    if (doneCallback) doneCallback(fixResponse(xhr.responseText));
                };

                // Upload It !!!
                switch (type) {

                case 'file':
                    
                    // Build a form to send data
                    var formData = new FormData();
                    formData.append('file', settings.content);
                    formData.append('upload_type', 'file');
                    formData.append('subtype', 'FILE');
                    formData.append('user_uuid', Service.$user.getUser().getInfo().user_uuid);
                    xhr.send(formData);
                    break;

                case 'txt':
                    $("#pp-composer-container-content-txt").val(settings.content); 
                    var form = document.forms.namedItem("pp-composer-container-form");
                    var data = new FormData(form);
                    xhr.send(data);
                    
                    break;
                    
                }

                this.progress = function(callback) {
                    progressCallback = callback;
                    return this;
                };

                this.done = function(callback) {
                    doneCallback = callback;
                    return this;
                };

                this.fail = function(callback) {
                    failCallback = callback;
                    return this;
                };

                this.cancel = function() {
                    if (status.state == 'CANCEL') return;

                    status.state = 'CANCEL';
                    xhr.abort();
                };

                this.query = function() {
                    return status;
                };
            };

        this.upload = function(settings) {
            return new UploadTask(settings);
        };

        this.cancel = function(uploadId) {
            if (uploadId && fileUploadPools[uploadId]) {
                fileUploadPools[uploadId].cancel();
            }
        };

        this.clear = function() {
            var self = this;
            $.each(fileUploadPools, function(key, value) {
                self.cancel(key);
            });
        };
        
    };

    // Error Code
    Uploader.ERROR_CODE = {
        SERVICE_NOT_AVALIABLE: 0, // Service not avaliable (XMLHttpRequest encounter error)
        CANCEL: 1 // Upload cancel
    };

    Service.Uploader = Uploader;
    Service.$uploader = new Uploader();
    
})(Service));

ppmessageModule.factory("FileChooser", [
    "$window",
function ($window) {

    function FileChooser() {
        // map files to dir-path
        this.filesMap = {};
    }

    // /storage/sdcard0/{""}
    FileChooser.ROOT_RELATIVE_PATH = "";

    FileChooser.prototype._errorHandler = function (e) {
        var msg = '',
            error = window.FileError;

        switch (e.code) {
        case error.QUOTA_EXCEEDED_ERR:
            msg = 'QUOTA_EXCEEDED_ERR';
            break;
        case error.NOT_FOUND_ERR:
            msg = 'NOT_FOUND_ERR';
            break;
        case error.SECURITY_ERR:
            msg = 'SECURITY_ERR';
            break;
        case error.INVALID_MODIFICATION_ERR:
            msg = 'INVALID_MODIFICATION_ERR';
            break;
        case error.INVALID_STATE_ERR:
            msg = 'INVALID_STATE_ERR';
            break;
        default:
            msg = 'Unknown Error' + e.code;
            break;
        }

        console.log('Error: ' + msg);
    };

    FileChooser.prototype._fillDirectorys = function (fileSystem, relativePath) {
        console.log('fill directorys : ' + relativePath);
        this.onBeforeFileClick(relativePath, true);

        if (this.filesMap[relativePath]) {
            console.log('[FileChooser]---->use Cache--->', relativePath);
            this.onDirectoryFilesLoadComplected(this.filesMap[relativePath]);
            return;
        }

        var that = this;

        fileSystem.root.getDirectory(relativePath, {create: false}, function (dirEntry) {

            function success(entries) {
                var fullPath = dirEntry.fullPath.slice(1, dirEntry.fullPath.length - 1),
                    root = (relativePath === "") ? true : false,
                    len = entries.length,
                    files = [],
                    i;

                fullPath = fullPath.indexOf('/') !== -1 ? dirEntry.fullPath + "../" : "";

                for (i = 0; i < len; i++) {
                    // ignore hidden entries
                    if (entries[i].name && entries[i].name.indexOf(".") == 0) continue;
                    files.push({
                        name: entries[i].name,
                        isDirectory: entries[i].isDirectory,
                        fullPath: entries[i].fullPath,
                        url: entries[i].toURL()
                    });
                }

                // sort entries by name
                files.sort(function (f1, f2) {
                    return f1.name < f2.name ? -1 : 1;
                });
                
                if (!root) {
                    files.unshift({
                        name: "..",
                        isDirectory: true,
                        fullPath: fullPath,
                        url: null
                    });
                }

                that.filesMap[relativePath] = { files: files, folder: dirEntry, root: root };
                that.onDirectoryFilesLoadComplected(that.filesMap[relativePath]);
            }

            function fail(error) {
                console("Failed to list directory contents: " + error.code);
                that.onDirectoryFilesLoadComplected([]);
            }

            var directoryReader = dirEntry.createReader();
            directoryReader.readEntries(success, fail);

        }, this._errorHandler);
    };

    /**
     * API: list directorys
     */
    FileChooser.prototype.fillDirectorys = function (relativePath) {
        if (this.fileSystem) {
            this._fillDirectorys(this.fileSystem, relativePath);
        } else {
            var that = this;

            $window.requestFileSystem = $window.requestFileSystem || $window.webkitRequestFileSystem;
            $window.requestFileSystem(LocalFileSystem.PERSISTENT, 1024 * 1024, function (fs) {
                that.fileSystem = fs;
                that._fillDirectorys(fs, relativePath);
            }, this._errorHandler);
        }

    };

    /**
     * API: readFile
     */
    FileChooser.prototype.getFile = function (fileRelativePath, successcallback, failcallback) {
        if (this.fileSystem) {
            this.fileSystem.root.getFile(fileRelativePath, {}, function (fileEntry) {

                fileEntry.file(function (file) {
                    if (successcallback) {
                        successcallback(file);
                    }
                });

            }, this._errorHandler);
        } else {
            failcallback('no filesystem');
        }
    };

    /**
     * API: Callback
     */
    FileChooser.prototype.onBeforeFileClick = function (filePath, isDirectory) {};

    /**
     * API: Callback
     */
    FileChooser.prototype.onDirectoryFilesLoadComplected = function (files) {};

    return FileChooser;
}]);

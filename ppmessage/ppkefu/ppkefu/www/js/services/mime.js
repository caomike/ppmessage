ppmessageModule.factory('yvMime', [function () {
    
    /*
      .doc     application/msword
      .docx    application/vnd.openxmlformats-officedocument.wordprocessingml.document
      .rtf     application/rtf
      .xls     application/vnd.ms-excelapplication/x-excel
      .xlsx    application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
      .ppt     application/vnd.ms-powerpoint
      .pptx    application/vnd.openxmlformats-officedocument.presentationml.presentation
      .pps     application/vnd.ms-powerpoint
      .ppsx    application/vnd.openxmlformats-officedocument.presentationml.slideshow
      .pdf     application/pdf
      .swf     application/x-shockwave-flash
      .dll     application/x-msdownload
      .exe     application/octet-stream
      .msi     application/octet-stream
      .chm     application/octet-stream
      .cab     application/octet-stream
      .ocx     application/octet-stream
      .rar     application/octet-stream
      .tar     application/x-tar
      .tgz     application/x-compressed
      .zip     application/x-zip-compressed
      .z       application/x-compress
      .wav     audio/wav
      .wma     audio/x-ms-wma
      .wmv     video/x-ms-wmv
      .mp3 .mp2 .mpe .mpeg .mpg     audio/mpeg
      .rm      application/vnd.rn-realmedia
      .mid .midi .rmi     audio/mid
      .bmp     image/bmp
      .gif     image/gif
      .png     image/png
      .tif .tiff  image/tiff
      .jpe .jpeg .jpg     image/jpeg
      .txt      text/plain
      .xml      text/xml
      .html     text/html
      .css      text/css
      .js       text/javascript
      .mht .mhtml   message/rfc822
    */

    function _mime_icon(_mime) {
        var _word = "img/document-word.png",
            _xls = "img/document-xls.png",
            _pdf = "img/document-pdf.png",
            _ppt = "img/document-ppt.png",
            _plain = "img/document-plain.png",
            _map = {
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document": _word,
                "application/msword": _word,
                "application/vnd.ms-excel": _xls,
                "application/x-excel": _xls,
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": _xls,
                "application/vnd.ms-powerpoint": _ppt,
                "application/vnd.openxmlformats-officedocument.presentationml.presentation": _ppt,
                "application/vnd.openxmlformats-officedocument.presentationml.slideshow": _ppt,
                "application/pdf": _pdf
            };

        if (_map.hasOwnProperty(_mime)) {
            return _map[_mime];
        }

        return _plain;
    }

    function _mime_ext(_mime) {
        var _map = {
            "application/msword": "doc",
            "application/x-excel": "xls",
            "application/vnd.ms-excel": "xls",
            "application/vnd.ms-powerpoint": "ppt",

            "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
            "application/vnd.openxmlformats-officedocument.presentationml.slideshow": "ppsx",
            "application/vnd.openxmlformats-officedocument.presentationml.presentation": "pptx",

            "application/pdf": "pdf",

            "image/jpeg": "jpeg",
            "image/png": "png",
            "image/tiff": "tiff",
            "image/gif": "gif"
        };

        if (_map.hasOwnProperty(_mime)) {
            return _map[_mime];
        }

        return "bin";
    }

    return {
        mime_icon: function (_mime) {
            return _mime_icon(_mime);
        },

        mime_ext: function (_mime) {
            return _mime_ext(_mime);
        }

    };
}]);

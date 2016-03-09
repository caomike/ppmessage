/*
 * guijin.ding@yvertical.com
 * copyright @ 2010-2015 
 * all rights reserved
 *
 */

$yvMime.$inject = [];
function $yvMime() {

    /*
      .doc     application/msword
      .docx    application/vnd.openxmlformats-officedocument.wordprocessingml.document
      .rtf     application/rtf
      .xls     application/vnd.ms-excel	application/x-excel
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
    
    
    var _mime_icon = function(_mime) {
        var _prefix = "../img/";
        var _word = _prefix + "document-word.png";
        var _xsl = _prefix + "document-xls.png";
        var _pdf = _prefix + "document-pdf.png";
        var _ppt = _prefix + "document-ppt.png";
        var _plain = _prefix + "document-plain.png";
        
        var _map = {
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document" : _word,
            "application/msword": _word,
            "application/vnd.ms-excel" : _xsl,
	        "application/x-excel": _xsl,
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" : _xsl,
            "application/vnd.ms-powerpoint" : _ppt,
            "application/vnd.openxmlformats-officedocument.presentationml.presentation" : _ppt,
            "application/vnd.ms-powerpoint" : _ppt,
            "application/vnd.openxmlformats-officedocument.presentationml.slideshow" : _ppt,
            "application/pdf" : _pdf,
        };
        
        if (_map.hasOwnProperty(_mime)) {
            return _map[_mime];
        }
        
        return _plain;
    };


    return {
        mime_icon: function(_mime) {
            return _mime_icon(_mime);
        },
    };
}

angular.module("this_app").factory('yvMime', $yvMime);

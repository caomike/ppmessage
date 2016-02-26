//
// @note: put the file after file `service/pp-message.js`
//
( function() {

    Service.PPMessage.Audio = AudioMessage;

    // @description
    //     build a new Audio Obj
    //
    // @param options {
    //     dura: 0 ~ +Infinity, default: 0
    //     fid: `fid`, default: undefined
    //     file: `file`, default: undefined
    // }
    function AudioMessage( options ) {

        var config = $.extend( { dura: 0,
                                 fid: undefined,
                                 file: undefined } , options.mp3 ),

            error = false,
            read = false,
            
            id = Service.$tools.getUUID(),
            duration = config.dura,
            fileId = config.fid,
            file = config.file,
            fileUrl = !Service.$tools.isNull( fileId ) ? Service.$tools.getFileDownloadUrl( fileId ) : undefined;

        //////// Public API //////////
        
        this.id = getId;
        this.src = getSrc;
        this.duration = getDuration;
        this.canPlay = canPlay;
        this.markError = markError;
        this.hasRead = hasRead;
        this.markRead = markRead;

        function getSrc() { return fileUrl };

        function getDuration() { return duration; }
        
        function getId() { return id; }

        function canPlay() {
            return !error && !Service.$tools.isNull( getSrc() );
        }

        function hasRead() { return read; }

        // Mark this `audio` is not `playable` or meet some unknown error when try to play
        function markError() { error = true; }

        // Mark this `audio` has read
        function markRead() { read = true; }
        
    };
    
} )();

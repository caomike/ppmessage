((function(View) {

    View.$userImageMessage = (function() {

        /**
         * @constructor HTML CODE
         */
        function PPConversationPartImageByUser(item) {
            View.PPDiv.call(this, 'pp-conversation-part-image-by-user');
            
            var MAX_WIDTH = 242, // img max-width 242px

                showUploadingBar = Service.$tools.isUploading(item),
                messageId = item.messageId,
                imgSelector = '#pp-conversation-part-' + messageId + ' .pp-conversation-part-image-by-user-img',
                error = Service.$tools.isMessageSendError(item),
                extra = error ? item.extra.errorDescription : item.extra.description,
                shouldOpacity = Service.$tools.isMessageSendError(item) || showUploadingBar,
                imageHref = item.message.image.url,
                imageViewable = isZoomable(),
                imageClass = 'pp-conversation-part-image-by-user-img' + (imageViewable ? ' pp-image-viewable' : ''),

                onImageClickEvent = function(event) { // on image click event callback
                    if (imageViewable) {
                        openInViewer($(imgSelector));
                    } else {
                        window.open($(imgSelector).attr('src'));
                    }
                },

                // because our `max-width` is fixed, `height` is detect autociamally in other browsers instead of IE9,
                // so we need to calculate `mx-height` dynamically in IE9 browser.
                // getImageMaxHeight = function() {
                //     return $(imgSelector).width() / MAX_WIDTH * $(imgSelector).height();
                // },

                getImageInitialStyle = function() {
                    var style = '';

                    style += shouldOpacity ? 'opacity: .6' : '';

                    if (!imageViewable) style += 'cursor:pointer';

                    return style;
                },

                // $image: `jQuery(img)`
                openInViewer = function($image) {
                    View.$imageViewer.show($image);
                };
            
            this.add(new View.PPDiv('pp-conversation-part-image-by-user-o')
                     .add(new View.PPElement('img', {
                         id: 'pp-conversation-part-image-by-user-img-' + item.messageId,
                         'class': imageClass,
                         src: item.message.image.data || item.message.image.url,
                         style: getImageInitialStyle(),
                         event: {
                             click: onImageClickEvent
                         }
                     }))
                     .add(new View.PPDiv({
                         id: 'pp-conversation-part-image-by-user-timestamp-' + item.messageId,
                         'class': 'pp-conversation-part-image-by-user-timestamp pp-selectable'
                     })
                          .add(new View.PPElement('span', {
                              id: 'pp-conversation-part-image-by-user-timestamp-span-' + item.messageId,
                              'class': 'pp-conversation-part-image-by-user-timestamp-span pp-font',
                              style: error ? 'color:red; display:block;' : 'color:#c9cbcf; display:none;'
                          })
                               .text(extra))
                          .show(!showUploadingBar))
                     .add(new View.PPDiv({
                         'class': 'pp-fixme'
                     })
                          .add(new View.PPUploadingBar(item).show(showUploadingBar))));
        }
        extend(PPConversationPartImageByUser, View.PPDiv);

        var isZoomable = function() { // is image can zoom
            return true;
        },

            build = function(item) { // generate a new ConversationPartImageByUser instance
                return new PPConversationPartImageByUser(item);
            },

            getImageSelector = function(messageId) { // get image selector
                return '#pp-conversation-part-image-by-user-img-' + messageId;
            },

            getImageTimestampContainerSelector = function(messageId) { //
                return '#pp-conversation-part-image-by-user-timestamp-' + messageId;
            },

            getImageTimestampSelector = function(messageId) {
                return '#pp-conversation-part-image-by-user-timestamp-span-' + messageId;
            },

            onBeginUpload = function(messageId) { // on begin upload

                var imageSelector = getImageSelector(messageId);

                // set image opacity from 1 to half-opacity
                $(imageSelector).css({ 'opacity': 0.6 });
                
            },

            onSendFail = function(messageId, errorDescription) {

                // change cursor
                $(getImageSelector(messageId)).css({
                    'opacity': 0.6,
                    'cursor': 'default'
                });

                // show error description
                $(getImageTimestampContainerSelector(messageId)).show();
                $(getImageTimestampSelector(messageId)).text(errorDescription).css({
                    'color': 'red',
                    'display': 'block'
                });
                
            },

            onSendDone = function(messageId, imageUrl) {

                $(getImageSelector(messageId)).css({
                    'opacity': 1.0
                });

            };

        return {
            build: build,

            onBeginUpload: onBeginUpload,
            onSendFail: onSendFail,
            onSendDone: onSendDone
        }
        
    })();
    
})(View));

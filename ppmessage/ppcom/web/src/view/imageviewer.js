/**
 *
 * zoom-in `small-image` to `big-image` in a half-transparent window
 *
 * [Use]:
 * View.$imageViewer.show(jQuery(`The image that you want to zoom-in`));
 *
 */
View.$imageViewer = (function() {

    // Html code
    function ImageViewer(imgSrc, imgStyle) {
        View.PPDiv.call(this, {
            'class': 'pp-image-viewer'
        });
        
        this.add(new View.PPDiv({ 'class': 'pp-image-viewer-overlay' }))
            .add(new View.PPElement('img', {'class':'pp-zoomed-image', src: imgSrc, style: imgStyle}));
        
    }
    extend(ImageViewer, View.PPDiv);

    var viewerOverlay = '.pp-image-viewer-overlay', // jQuery element selectors
        containerSelector = '#pp-container',
        imageViewerSelector = '.pp-image-viewer',
        imgSelector = '.pp-image-viewer img',

        padding = 20, // zoomed image padding to body

        $scaleImage, // the image which you want to zoom-in
        smallImageAttrs, // contains small image's size and position info
        bigImageAttrs, // contains big image's size and position info

        initialImageStyle, // the initial style that will apply to image

        prepareToShowImageViewer = function($image) { // prepare show image
            $scaleImage = $image;

            // calc big image and small image size and position info
            calcSmallImageAttrs($scaleImage);
            calcBigImageAttrs(window.innerWidth, window.innerHeight, $scaleImage);

            // initial image style
            initialImageStyle = 'width:' + smallImageAttrs.width + 'px;' +
                'height:' + smallImageAttrs.height + 'px;' +
                'left:' + smallImageAttrs.left + 'px;' +
                'top:' + smallImageAttrs.top + 'px';
        },

        onImageViewerShow = function() { // on big image show callback

            // listen browser resize event
            $(window).on('resize.pp-image-viewer', onResize);

            // bind click event
            $(viewerOverlay).bind('click', onClick);
            $(imageViewerSelector + ' img').bind('click', onClick);

            // bind keyup event
            $(document).on('keyup.pp-image-viewer', onKeyUp);
        },

        onImageViewerClose = function() { // on big image hide

            // off keyup event
            $(document).off('keyup.pp-image-viewer');

            // off browser resize event
            $(window).on('resize.pp-image-viewer');
        },

        calcSmallImageAttrs = function($smallImage) { // calculate small image `width`,`height`,`left`,`top`                
            smallImageAttrs = {
                width: $smallImage.width(), // size info
                height: $smallImage.height(),
                left: $smallImage.offset().left - $(document).scrollLeft(), // position info
                top: $smallImage.offset().top - $(document).scrollTop()
            };
        },

        calcBigImageAttrs = function(windowWidth, windowHeight, $bigImage) { // calculate big image info
            var image = $bigImage[0],
                targetWidth = windowWidth - 2 * padding,
                targetHeight = windowHeight - 2 * padding,
                scale = Math.min(targetWidth / image.naturalWidth,
                                 targetHeight / image.naturalHeight); // zoom-in or zoom-out

            scale > 1 && (scale = 1); // scale <= 1

            var width = image.naturalWidth * scale,
                height = image.naturalHeight * scale,
                left = windowWidth / 2 - width / 2,
                top = windowHeight / 2 - height / 2;

            bigImageAttrs = {
                width: width, // size info
                height: height,
                left: left, // position info
                top: top
            };
        },

        show = function($image) { // show

            prepareToShowImageViewer($image);

            // append html to dom
            $(containerSelector).append (
                new ImageViewer($image[0].src, initialImageStyle).getElement()[0].outerHTML); // generate html code

            // after show
            onImageViewerShow();

            // animate small image --> big image
            $(imgSelector).animate(
                bigImageAttrs, {
                    duration: 100,
                    queue: false,
                    easing: 'easeInQuart'
                });

            // animation image overlay opacity 0 -> .8
            $(viewerOverlay).animate({
                opacity: .8,
                queue: false,
                easing: 'easeInQuart'
            }, 200);
            
            return this;
        },

        remove = function() { // remove self
            $(imageViewerSelector).remove();
        },

        resize = function(windowWidth, windowHeight) { // re caculate image's size and position
            calcBigImageAttrs(windowWidth, windowHeight, $scaleImage);
            $(imgSelector).css(bigImageAttrs);
        },

        close = function() { // close 

            calcSmallImageAttrs($scaleImage);

            // animate big image --> small image
            $(imgSelector)
                .animate(smallImageAttrs, {
                    queue: false,
                    duration: 200
                });

            // animate opacity .8 --> 0
            $(viewerOverlay)
                .animate({ opacity: 0 }, {
                    queue: false,
                    duration: 500
                });

            // waiting 700ms then remove image-viewer
            // `remove()` event can not add to `$.animate([complete])` callback,
            // it seems like that jQuery duration not so accurate,
            // so just set a more bigger duration to wait to remove it
            setTimeout(function() {
                remove();
            }, 700);

            // unbind event
            onImageViewerClose();
        },

        onClick = function() { // onClick Event
            close();
        },

        onKeyUp = function(e) { // on `Esc` Key pressed
            27 === e.keyCode && close(); // Esc
        },

        onResize = function(e) { // on browser size changed
            resize(window.innerWidth, window.innerHeight);
        };

    return {
        show: show
    }
    
})();

View.$groupContentItem = (function() {

    function Item(data) {
        View.PPDiv.call(this, {
            'class': 'pp-group-item',
            group_uuid: data.uuid
        });

        var groupName = data.name,
            timeStamp = '',
            groupID = data.uuid,
            icon = data.icon,
            summary = data.summary,

            buildAvatar = function() {
                return new View.Img( {
                    src: icon
                } );
            },
            
            buildBody = function() {
                return new View.PPDiv({
                    'class': 'body-container'
                })
                    .add(new View.PPDiv({
                        'class': 'pp-body'
                    })
                         .add(new View.PPDiv({
                             'class': 'pp-header'
                         })
                              .add(new View.PPDiv({
                                  'class': 'pp-timestamp'
                              })
                                   .add(new View.Span({
                                       'class': 'pp-unread'
                                   }).text(timeStamp)))
                              .add(new View.PPDiv({
                                  'class': 'title-container'
                              })
                                   .add(new View.PPDiv({
                                       'class': 'pp-title'
                                   }).text(groupName))))
                         .add(new View.PPDiv({
                             'class': clsSummary
                         })
                              .add(new View.PPDiv({
                                  'class': 'readstate'
                              }))
                              .add(new View.Div( { className: 'pp-content' } )
                                   .text(summary))));
            },

            buildEvent = function() {
                var $e = findItem(groupID),
                    hoverClass = 'pp-group-item-hover';
                
                $e.bind('mouseover', function() {
                    $e.addClass(hoverClass);
                }).bind('mouseleave', function() {
                    $e.removeClass(hoverClass);
                }).click('click', function() {
                    Ctrl.$conversationList.showItem( groupID );
                });
                
            };

        // Build HTML
        this.add(buildAvatar())
            .add(buildBody());

        // Build Event
        $timeout(buildEvent);

    }
    extend(Item, View.PPDiv);
    
    var clsSummary = 'pp-summary',
        clsSummarySelector = '.' + clsSummary + ' .pp-content',

        findItem = function(groupUUID) {
            return $('.pp-group-content-container')
                .find('div[group_uuid=' + groupUUID +']');
        },

        // @param groupUUID
        // @param unread > 0 --> show red circle
        showUnread = function(groupUUID, unread) {
            unread > 0 && findItem(groupUUID).find('.readstate').text( unread > 99 ? 99 : unread ).show();
        },

        hideUnread = function(groupUUID) {
            findItem(groupUUID).find('.readstate').hide();
        },

        findGroupItemImg = function ( groupUUID ) {
            return $( '.pp-group-content-container div[group_uuid=' + groupUUID + '] img' );
        },

        groupIcon = function ( groupUUID, user ) {

            if ( groupUUID && user ) {
                
                findGroupItemImg ( groupUUID )
                    .attr( 'src', user.user_avatar )
                    .attr( 'user_uuid', user.user_uuid );
                
            } else {
                return findGroupItemImg ( groupUUID )
                    .attr( 'src' );
            }
            
        },

        build = function(data) {
            return new Item(data);
        };

    return {
        build: build,

        showUnread: showUnread,
        hideUnread: hideUnread,

        // act as setter and getter
        groupIcon: groupIcon,

        // act as setter
        description: description
    }

    function description( token, desc ) {
        findItem( token ).find( clsSummarySelector ).text( desc );
    }
    
})();

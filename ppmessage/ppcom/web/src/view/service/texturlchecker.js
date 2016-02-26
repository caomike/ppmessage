/**
 * 
 * Given a string, test whether or not it includes a link url.
 *
 * [Example]:
 *
 * var p = "abcde www.baidu.com defgeh https://ppmessage.cn xyz"
 *
 * var urlChecker = new View.TextUrlChecker();
 * var html = urlChecker.match(p).trustAsHtml();
 * console.log(html);
 * // abcde <a href='www.baidu.com' target='_blank'>www.baidu.com</a> defgeh <a href='https://ppmessage.cn' target='_blank'>https://ppmessage.cn</a> xyz
 *
 * p = "123456abcdef";
 * var nonHtml = urlChecker.match(p).trustAsHtml();
 * console.log(nonHtml);
 * // 123456abcdef
 *
 */
((function(View) {

    /**
     * source: source
     * include: true/false
     *
     * matchIndexArray:
     *     [{begin:1, end:5, url:xxx}, {begin:8, end:10, url:xxx}, ...]
     */
    function TextUrlCheckerResult(source, include, matchIndexArray) {
        this.source = source;
        this.include = include;
        this.matchIndexArray = matchIndexArray;
    }
    TextUrlCheckerResult.prototype.trustAsHtml = function(cssClass) {
        if (!this.include) {
            return this._encodeHtmlEntity(this.source);
        }
        var source = this.source;
        var matchIndexArray = this.matchIndexArray;
        var html = "";
        var sourceBegin = 0;
        var that = this;
        $.each(matchIndexArray, function(index, item) {
            html += that._encodeHtmlEntity(source.substring(sourceBegin, item.begin));
            
            //build link
            var fixHref = /^https?:\/\//.test(item.url) ? item.url : 'http://' + item.url;
            html += "<a href='" + fixHref + "' target='_blank'";
            if (cssClass) html += " class='" + cssClass + "'";
            html += ">";
            html += item.url;
            html += "</a>";

            sourceBegin = item.end;
        });
        if (sourceBegin < source.length) {
            html += this._encodeHtmlEntity(source.substring(sourceBegin, source.length));
        }
        return html;
    };

    //http://www.w3schools.com/html/html_entities.asp
    TextUrlCheckerResult.prototype._encodeHtmlEntity = function(text) {
        var res = text;
        res = res.replace(/</g, '&lt;');
        res = res.replace(/>/g, '&gt;');
        return res;
    };

    function TextUrlChecker() {
    }

    TextUrlChecker.UrlPattern = /(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[a-zA-Z0-9\/\-\.=_&%#?:;|]{2,}|www\.[^\s"']+\.[a-zA-Z0-9\/\-\.=_&%#?:;|]{2,})/g;

    TextUrlChecker.prototype.match = function(text) {
        var myArray;
        var matchIndexArray = [];
        var re = TextUrlChecker.UrlPattern;
        while ((myArray = re.exec(text)) !== null) {
            matchIndexArray.push({
                begin: myArray.index,
                end: re.lastIndex,
                url: myArray[0]
            });
        }
        return new TextUrlCheckerResult(text, matchIndexArray.length != 0, matchIndexArray);
    }

    View.TextUrlChecker = TextUrlChecker;
    
})(View));

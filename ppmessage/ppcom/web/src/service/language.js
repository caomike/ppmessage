Service.$language = ( function() {

    var _DEFAULT = 'zh-CN',
        _language = _DEFAULT;

    return {
        getLanguage: getLanguage,
        setLanguage: setLanguage
    }
    
    function getLanguage() {
        return _language;
    }

    function setLanguage( language ) {
        if (language) {
            language = language.toLowerCase();
        }
        switch(language) {
        case 'zh-cn':
            _language = 'zh-CN';
            break;

        case 'en':
            _language = 'en';
            break;

        default:
            _language = _DEFAULT;
            break;
        }
    }
    
} )();

GLang.listCookies = function(rawCookieString){
    var result = [];
    var splitBySemicolon = rawCookieString.split(";");
    for(var i=0;i < splitBySemicolon.length;i++) {
        var cookie = splitBySemicolon[i];
        while (cookie.charAt(0)==' ') cookie = cookie.substring(1,cookie.length);
        var name = cookie.split("=")[0];
        if(name !== "") result.push(name);
    }
    return result;
}

GLang.getCookie = function(rawCookieString, name) {
    var nameEQ = encodeURIComponent(name) + "=";
    var ca = rawCookieString.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return decodeURIComponent(c.substring(nameEQ.length,c.length));
    }
    return null;
}
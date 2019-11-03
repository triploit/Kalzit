var pending = [];

var pulled = [];
function pullCookie(name){
    if(!GLang.getCookie(document.cookie, "calcitUserToken")) return;
    if(pulled.includes(name)) return;
    
    var response = GLang.packageManager.loadUrl("/api/pullCookie?cookie=" + encodeURIComponent(name)).split("\n");
    console.warn(response);
    if(response[0] === "0"){
        setCookie(name, decodeURIComponent(response[1]));
    }
    pulled.push(name);
}

//This variable is used to list new / unpushed cookies
var toPush = [];

function pushCookie(name){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/api/pushCookie?cookie=" + encodeURIComponent(name));
    xhr.onload = function () {
        if (this.status >= 200 && this.status < 300) {
            //Success!
        } else {
            toPush.push(name);
        }
    };
    xhr.onerror = function () {
        toPush.push(name);
    };
    xhr.send();
}

function pullCookies(){
    if(!GLang.getCookie(document.cookie, "calcitUserToken")) return;
    var list = GLang.listCookies(document.cookie);
    for(var i = 0; i < list.length; i++){
        pullCookie(list[i]);
    }
}

function pushNewCookies(){
    if(!GLang.getCookie(document.cookie, "calcitUserToken")) return;
    while(toPush.length){
        pushCookie(toPush.pop());
    }
}
function pushAllCookies(){
    if(!GLang.getCookie(document.cookie, "calcitUserToken")) return;
    var list = GLang.listCookies(document.cookie);
    for(var i = 0; i < list.length; i++){
        pushCookie(list[i]);
    }
}

if(serverPullEnabled) pullCookies();

function queque(f){
    if(cookiesRejected) return;
    if(!notificationShown){
        var defaultCookieBanner = GLang.defaultRuntimeEnvironment.resolveName("defaultCookieBanner");
        GLang.callObject(GLang.defaultRuntimeEnvironment.resolveName("print"), GLang.defaultRuntimeEnvironment, [defaultCookieBanner]);
        notificationShown = true;
    }
    pending.push(f);
}

function setCookie(name,value) {
    if(!cookiesEnabled){
        queque(function(){setCookie(name, value)});
    }else{
        var expires = "";
        var date = new Date();
        date.setTime(date.getTime() + 3 * 365 * 24 * 60 * 60 * 1000);
        expires = "; expires=" + date.toUTCString();
        document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value || "")  + expires + "; path=/";
    }
}

function renewCookies(){
    var cookieList = GLang.listCookies(document.cookie);
    for(var i = 0; i < cookieList.length; i++){
        setCookie(cookieList[i], GLang.getCookie(document.cookie, cookieList[i]));
    }
    pushNewCookies();
}
function startCookieRefreshLoop(){
    //Push all new cookies frequently
    setInterval(renewCookies, 1 * 1000);
    //Push all cookies shortly after they are accessed the first time
    setTimeout(pushAllCookies, 15 * 1000);
}

function deleteCookie(name) {
    if(!cookiesEnabled){
        queque(function(){deleteCookie(name)});
    }else{
        document.cookie = name+'=; Max-Age=-99999999;';
    }
}

this.storageSaveString = function(name, value){
    setCookie(name, value);
    if(!toPush.includes(name) )toPush.push(name);
    var date = new Date();
    var currentTime = date.getTime();
    date.setTime(date.getTime() + 3 * 365 * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
    document.cookie = encodeURIComponent("__calcitCookieDate__" + name) + "=" + currentTime  + expires + "; path=/";
};
this.storageRemove = deleteCookie;
this.storageLoadString = function(name){
    if(serverPullEnabled) pullCookie(name);
    return GLang.getCookie(document.cookie, name);
};
this.storageListKeys = function(){return GLang.listCookies(document.cookie)};

var cookiesEnabled = GLang.getCookie(document.cookie, "calcitCookiesEnabled");
if(cookiesEnabled){
    startCookieRefreshLoop();
}
var cookiesRejected = false;
var notificationShown = false;
var serverPushEnabled = true;
var serverPullEnabled = true;

this.acceptCookies = function acceptCookies(){
    cookiesEnabled = true;
    for(var i = 0; i < pending.length; i++){
        pending[i]();
    }
    setCookie("calcitCookiesEnabled", "true");
    startCookieRefreshLoop();
}

this.rejectCookies = function rejectCookies(){
    cookiesRejected = true;
    pending = [];
}
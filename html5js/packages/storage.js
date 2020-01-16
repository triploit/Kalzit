;(function(thiz){

    //For the future
    function withLocalStorage(onSuccess, onError){
        try{
            if(localStorage) {
                onSuccess(localStorage);
            }else{
                throw new Error("Does not work");   
            }
        }catch (e){
            if(onError) onError(e);
        }
    }
    function deleteOnlyCookie(name){
        document.cookie = name+'=INVALID; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';   
    }
    deleteOnlyCookie("calcitUserToken");

    var pending = [];
    
    var pulled = [];
    function pullCookie(name){
        withLocalStorage(function(storage){
            if(!storage.getItem("calcitUserToken")) return;
            if(pulled.includes(name)) return;
            
            var response = GLang.packageManager.loadUrl("/api/pullCookie", [
                ["kalzit-user-token", storage.getItem("calcitUserToken")],
                ["kalzit-cookie-name", name]
            ]).split("\n");
            if(response[0] === "0"){
                setCookie(name, decodeURIComponent(response[1]));
            }
            pulled.push(name);
        })
    }
    
    //This variable is used to list new / unpushed cookies
    var toPush = [];
    
    var deleted = [];
    function pushCookie(name){
        if(deleted.includes(name)) return;
    
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "/api/pushCookie");
        xhr.setRequestHeader("kalzit-cookie-name", name);
        xhr.setRequestHeader("kalzit-cookie-value", encodeURIComponent(thiz.storageLoadString(name)));
        xhr.setRequestHeader("kalzit-user-token", thiz.storageLoadString("calcitUserToken"));
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
        if(!thiz.storageLoadString("calcitUserToken")) return;
        var list = thiz.storageListKeys();
        for(var i = 0; i < list.length; i++){
            pullCookie(list[i]);
        }
    }
    
    function pushNewCookies(){
        if(!thiz.storageLoadString("calcitUserToken")) return;
        while(toPush.length){
            pushCookie(toPush.pop());
        }
    }
    function pushAllCookies(){
        if(!thiz.storageLoadString("calcitUserToken")) return;
        withLocalStorage(function(storage){
            for(var i = 0; i < storage.length; i++){
                pushCookie(storage.key(i));
            }
        });
    }
    
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
        //For the future
        withLocalStorage(function(storage){
            storage.setItem(name, value);
            deleteOnlyCookie(name);
            toPush.push(name);
        });
    }
    
    function startCookieRefreshLoop(){
        //Push all new cookies frequently
        setInterval(pushNewCookies, 1 * 1000);
        //Push all cookies shortly after they are accessed the first time
        setTimeout(pushAllCookies, 15 * 1000);
    }
    
    function deleteCookie(name) {
        console.log("Trying to delete cookie " + name);
        deleted.push(name);
        deleteOnlyCookie(name);
        GLang.packageManager.loadUrl("/api/deleteCookie?cookie=" + encodeURIComponent(name));
        
        withLocalStorage(function(storage){
            storage.removeItem(name);
        });
    }
    
    thiz.storageSaveString = setCookie;
    thiz.storageRemove = deleteCookie;
    thiz.storageLoadString = function(name){
        var result;
        pullCookie(name);
        withLocalStorage(function(storage){
            result = storage.getItem(name);
            deleteOnlyCookie(name);
        });
        return result;
    };
    thiz.storageListKeys = function(){
        var list = [];
        withLocalStorage(function(storage){
            for(var i = 0; i < storage.length; i++){
                list.push(storage.key(i));   
            }
        });
        console.log(list);
        return list;
    };
    
    var token = thiz.storageLoadString("calcitUserToken");
    console.log("calcitUserToken is " + token);
    if(token !== null){
        token = "" + token;
        if(!token.match( new RegExp("[a-f0-9]{8}\\-[a-f0-9]{4}\\-[a-f0-9]{4}\\-[a-f0-9]{4}\\-[a-f0-9]{12}") )) {
            alert("The account you are logged in with seems invalid: (" + token + "). You are logged out now and your local data are deleted to try to make the app work again. Please try to  login again. If you see an error message which does not go away after reloading or if you see this message again, please ask for help.");
            
            //Reset all data
            thiz.storageRemove("calcitUserToken");
            withLocalStorage(function(storage){
                for(var i = storage.length - 1; i >= 0; i--){
                    storage.removeItem(storage.key(i));
                }
            });
            
            location.reload();
        }else{
            console.log("User token seems valid");
        }
    }
    
    pullCookies();
    startCookieRefreshLoop();
})(this);
;(function(thiz){

    var nativeStorage = KNI.hasStorage() ? KNI.getStorage() : null;
    
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
    
    //Native function wrappers, from browser API or KNI
    var native_loadString = nativeStorage ? function(key){
        return nativeStorage.loadString(key) || null;
    } : function(name){
        //browser
        var result;
        withLocalStorage(function(storage){
            result = storage.getItem(name);
        });
        return result;
    };
    var native_saveString = nativeStorage ? function(key, value){
        nativeStorage.saveString(key, value);
    } : function(name, value){
        //browser
        withLocalStorage(function(storage){
            storage.setItem(name, value);
        });
    };
    
    function getServerCookies(){
        var token = native_loadString("calcitUserToken");
        if(!token) return;
        
        try{
            return JSON.parse(GLang.packageManager.loadUrl("/api/cookieJson", [
                 ["kalzit-user-token", token]
            ]));   
        }catch(e){}
    }
    
    var serverCookies = {};
    function pullAllCookies(){
        var response = serverCookies = getServerCookies();
        serverCookies = serverCookies || {};
        if(response){
            for(var key in response){
                var value = response[key];
                if("string" === typeof value) native_saveString(key, value);
            }
        }
    }
    
    //This variable is used to list new / unpushed cookies
    var toPush = [];
    
    var deleted = [];
    function pushCookie(name){
        if(deleted.includes(name)) return;
    
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "/api/pushCookie");
        xhr.setRequestHeader("kalzit-cookie-name", name);
        xhr.setRequestHeader("kalzit-cookie-value", encodeURIComponent(native_loadString(name)));
        xhr.setRequestHeader("kalzit-user-token", native_loadString("calcitUserToken"));
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
    
    function pushNewCookies(){
        if(!native_loadString("calcitUserToken")) return;
        while(toPush.length){
            pushCookie(toPush.pop());
        }
    }
    
    //This should only be called after pullAllCookies, or after serverCookies is {}
    function pushAllCookies(){
        if(!native_loadString("calcitUserToken")) return;
        var keyList = thiz.storageListKeys();
        console.log("Trying to push these keys: " + JSON.stringify(keyList));
        for(var i = 0; i < keyList.length; i++){
            var key = keyList[i];
            if(serverCookies[key] !== native_loadString(key)) pushCookie(key);
        }
    }
    
    function setCookie(name,value) {
        //For the future
        native_saveString(name, value)
        toPush.push(name);
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
        GLang.packageManager.loadUrl("/api/deleteCookie?cookie=" + encodeURIComponent(name));
        
        withLocalStorage(function(storage){
            storage.removeItem(name);
        });
    }
    
    thiz.storageSaveString = setCookie;
    thiz.storageRemove = nativeStorage ? function(k){nativeStorage.remove(k)} : deleteCookie;
    thiz.storageLoadString = native_loadString;
    thiz.storageListKeys = nativeStorage ? function(){return JSON.parse(nativeStorage.listKeysAsJson())} : function(){
        var list = [];
        withLocalStorage(function(storage){
            var length = storage.getLength ? storage.getLength() : storage.length;
            for(var i = 0; i < length; i++){
                list.push(storage.key(i));
            }
        });
        console.log(list);
        return list;
    };
    
    var token = native_loadString("calcitUserToken");
    console.log("calcitUserToken is " + token);
    if(token === undefined){
        //No storage support
        alert("Your browser does not support or allow storing data locally. The functionality of this app might be limited by that.");
    } else if(token !== null){
        token = "" + token;
        if(!token.match( new RegExp("[a-f0-9]{8}\\-[a-f0-9]{4}\\-[a-f0-9]{4}\\-[a-f0-9]{4}\\-[a-f0-9]{12}") )) {
            alert("The account you are logged in with seems invalid: (" + token + "). You are logged out now and your local data are deleted to try to make the app work again. Please try to  login again. If you see an error message which does not go away after reloading or if you see this message again, please ask for help.");
            
            //Reset all data
            thiz.storageRemove("calcitUserToken");
            withLocalStorage(function(storage){
                storage.clear();
            });
            
            location.reload();
        }else{
            console.log("User token seems valid");
        }
    }
    
    //Only do this if there is a user LOGGED IN - otherwise, data could be overwritten after login
    if (native_loadString("calcitUserToken")){
        if(nativeStorage && nativeStorage.wantsFullPush()){
            pushAllCookies();
        }
        pullAllCookies();
        startCookieRefreshLoop();
    }
})(this);
;(function(thiz){
    
    /*
    This is a helper function used for anything that has to do with local storage.
    It tests wether localStorage exists, and if it does the "onSuccess" function is called with the global "localStorage" object.
    
    If either localStorage does not exist as an API or (probably more important) if onSuccess throws an error when called, "onError" is called with the thrown exception.
    Basically you can very easily prevent an exception from being thrown, because it is handled in pretty much any case. The only exception would be any error thrown by "onError".
    
    Please note that "onSuccess" is a required parameter, while "onError" is optional.
    */
    function withLocalStorage(onSuccess, onError){
        try{
            //Check if localStorage is available
            if(localStorage) {
                //If so, try to run "onSuccess" - if that ends well, this function stops.
                onSuccess(localStorage);
            }else{
                //localStorage does not exist
                throw new Error("The localStorage API is not available");   
            }
        }catch (e){
            //Any error occured - use the error handler if present
            if(onError) onError(e);
        }
    }
    
    /**
    Expects a key (JS string) as a parameter and searches the storage for this key.
    If it was found, the value stored with it is returned (also a JS string).
    */
    var native_loadString = function(name){
        //browser
        var result;
        withLocalStorage(function(storage){
            result = storage.getItem(name);
        });
        return result;
    };
    
    /**
    Expects a key (JS string) and a value to store with it (JS string) as a parameter and stores the value under the given key.
    */
    var native_saveString = function(name, value){
        //browser
        withLocalStorage(function(storage){
            storage.setItem(name, value);
        });
    };
    
    //TODO: change name, since browser cookie are not the underlying technology of this whole API.
    /**
    Returns a JS object representing the server-side data available for the current session.
    
    This function requires the Kalzit Server to work. If the server is not reachable or if there is no session id (stored locally as "calcitSession"), "undefined" is returned.
    
    The resulting object is structured like this:
        {
            keyA: "StringValue",
            otherKey: "other string value"
        };
        
    You can be certain that all properties of this object (not including any prototypes!) contain stored values.
    */
    function getServerCookies(){
        var token = native_loadString("calcitSession");
        if(!token) return;
        
        try{
            return JSON.parse(GLang.packageManager.loadUrl("/api/cookieJson", [
                 ["kalzit-session", token]
            ]));
        }catch(e){}
    }
    
    //TODO: change name, since browser cookie are not the underlying technology of this whole API.
    /**
    Holds a representation of all the key-value-pairs that were available on the server when the storage API was initiated the last time (probably the first app start / any restart).
    This is helpful because pulling the data from the server is rather slow and uses bandwidth, so it should be avoided as much as possible.
    
    So, instead of doing that every time, all functions that need to access server-side storage data can just use this object.
    Please note that "pullAllCookies()" has to be called before this variable is used.
    */
    var serverCookies = null;
    
    //TODO: change name, since browser cookie are not the underlying technology of this whole API.
    /**
    This function loads all stored data available at the Kalzit Server and puts the key-value-pairs in two places:
        1. It fills the "serverCookies" variable with it. That means "pullAllCookies()" has to be called before that is used.
        2. It populates the persistent local storage with it ("localStorage").
        
    In case of the "serverCookies" variable, all values in there are deleted first.
    In case of the persistent local storage, everything is kept at first, but any key that was available on the server will be overwritten locally (with the server-side value)
    */
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
    
    //This variable is used to list new / unpushed keys - use "pushNewCookies" to handle these
    var toPush = [];
    
    //Lists names that must never be pushed by "pushCookies", even if they are in the name list.
    var deleted = [];
    
    //TODO: change name, since browser cookie are not the underlying technology of this whole API.
    /*
    Pushes a single key-value-pair (represented by its "key"-part) to the server.
    The main function for this purpose would be "pushCookies" (with an "s") - if you want to push multiple key-value-pairs, that one is a lot faster.
    */
    function pushCookie(name){
       pushCookies([name]);
    }
    
    //TODO: change name, since browser cookie are not the underlying technology of this whole API.
    /*
    Pushes multiple key-value-pairs (represented by their "key"-parts) to the server.
    TODO: Document additional behavior like "deleted" checks
    */
    function pushCookies(nameList){
        var pushedObject = {};
        var actualPush = false;
        for(var i = 0; i < nameList.length; i++){
            var name = nameList[i];
            if(deleted.includes(name)) continue;
            pushedObject[name] = native_loadString(name);
            actualPush = true;
        }
        if(!actualPush) return;
        
        //Send JSON to special API
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "/api/updateCookieJson");
        xhr.setRequestHeader("kalzit-cookie-json", JSON.stringify(pushedObject));
        xhr.setRequestHeader("kalzit-session", native_loadString("calcitSession"));
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
    
    //TODO: change name, since browser cookie are not the underlying technology of this whole API.
    /*
    Pushes all key-value-pairs to the server that are new or have changed since the last successful push.
    This causes the "toPush" variable to become an empty array - however, if the pushing of some keys fails, that might change quickly again.
    */
    function pushNewCookies(){
        var toPushCopy = toPush;
        toPush = [];
        pushCookies(toPushCopy);
    }
    
    //TODO: change name, since browser cookie are not the underlying technology of this whole API.
    //This should only be called after pullAllCookies, or after serverCookies is {}
    /**
    Pushes all key-value-pairs to the server that are new or have changed locally since the last successful pull (here is the difference to "pushNewCookies").
    */
    function pushAllCookies(){
        if(!native_loadString("calcitSession")) return;
        var keyList = thiz.storageListKeys();
        console.log("Trying to push these keys: " + JSON.stringify(keyList));
        for(var i = 0; i < keyList.length; i++){
            var key = keyList[i];
            if(serverCookies[key] !== native_loadString(key)) pushCookie(key);
        }
    }
    
    //TODO: change name, since browser cookie are not the underlying technology of this whole API.
    //TODO: The name is also bad because this starts only pushing, not (!) pulling - "refresh" suggests that both might happen.
    /**
    Initiates the background tasks that make sure (or at least try to) that all locally stored key-value-pairs are automatically pushed to the server when changed.
    */
    function startCookieRefreshLoop(){
        //Push all new cookies frequently
        setInterval(pushNewCookies, 3 * 1000);
        //Push all cookies shortly after they are accessed the first time
        setTimeout(pushAllCookies, 15 * 1000);
    }
    
    //TODO: change name, since browser cookie are not the underlying technology of this whole API.
    function deleteCookie(name) {
        console.log("Trying to delete cookie " + name);
        deleted.push(name);
        GLang.packageManager.loadUrl("/api/deleteCookie?cookie=" + encodeURIComponent(name));
        
        withLocalStorage(function(storage){
            storage.removeItem(name);
        });
    }
    
    //TODO: Add the ability to use arrow functions ( arg => stuff() ) without breaking everything.
    thiz.storageSaveString = function(name, value) {
        native_saveString(name, value)
        toPush.push(name);
    };
    thiz.storageRemove = deleteCookie;
    thiz.storageLoadString = native_loadString;
    thiz.storageListKeys = function(){
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
    
    //Get and validate the current session
    var token = native_loadString("calcitSession");
    console.log("calcitSession is " + token);
    if(token === undefined){
        //No storage support
        alert("Your browser does not support or allow storing data locally. The functionality of this app might be limited by that.");
    } else if(token !== null){
        token = "" + token;
        var tokenAsNumber = parseFloat(token);
        if(tokenAsNumber !== tokenAsNumber || tokenAsNumber > 1 || tokenAsNumber < 0) {
            alert("Your session seems invalid (" + token + "; " + tokenAsNumber + "). You are logged out now and some of your local data are deleted to try to make the app work again. Please try to  login again. If you see an error message which does not go away after reloading or if you see this message again, please ask for help.");
            
            //Reset all data
            thiz.storageRemove("calcitSession");
            thiz.storageRemove("calcitUserToken");
            withLocalStorage(function(storage){
                storage.clear();
            });
            
            location.reload();
        }else{
            console.log("Session seems valid");
        }
    }
    
    //Pull values from the server and initiate the pushing services
    //Only do this if a session is active - otherwise, data could be overwritten after login
    if (token){
        //Pulling needs to happen before starting the push services
        pullAllCookies();
        startCookieRefreshLoop();
        
        //Attempt push before tab is closed (not certain)
        window.addEventListener("beforeunload", function(event) {
            pushNewCookies();
        });
    }
    
})(this);
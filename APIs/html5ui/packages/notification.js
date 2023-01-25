function withNotification(callback, onError){
	if(window.Notification) {
		return callback(window.Notification)
	}else{
		return onError;
	}
}

function notificationSupported(){
	return withNotification(Notification => {
		return true
	}, false)
}
this.notificationSupported = notificationSupported;

function notificationForbidden(){
	return withNotification(Notification => {
		return Notification.permission === "denied"
	}, true)
}
this.notificationForbidden = notificationForbidden;

function notificationAllowed(){
	return withNotification(Notification => {
		return Notification.permission === "granted"
	}, false)
}
this.notificationAllowed = notificationAllowed;

function notificationRequestPermission(){
	withNotification(Notification => {
		Notification.requestPermission();
	})
}
this.notificationRequestPermission = notificationRequestPermission;

this.notificationShowShortText = function(text){
	if(!notificationAllowed()) {
		notificationRequestPermission();
	}else{
		withNotification(Notification => {
			var notification = new Notification(text, {body: text, requireInteraction: true});
			notification.onclick = function(event) {
				event.preventDefault(); // prevent the browser from focusing the Notification's tab
				GLang.callObject(GLang.eval("showMessageAsync"), GLang.defaultRuntimeEnvironment, [GLang.voidValue, GLang.stringValue(text)]);
				notification.close();
			}
		})
	}
}
this.notificationShowLongText = function(summary, full){
	if(!notificationAllowed()) {
		notificationRequestPermission();
	}else{
		withNotification(Notification => {
			var notification = new Notification(summary, {body: full, requireInteraction: true});
			notification.onclick = function(event) {
				event.preventDefault(); // prevent the browser from focusing the Notification's tab
				GLang.callObject(GLang.eval("showMessageAsync"), GLang.defaultRuntimeEnvironment, [GLang.voidValue, GLang.stringValue(full)]);
				notification.close();
			}
		})
	}
}
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
this.notification_supported = notificationSupported;

function notificationForbidden(){
	return withNotification(Notification => {
		return Notification.permission === "denied"
	}, true)
}
this.notification_forbidden = notificationForbidden;

function notificationAllowed(){
	return withNotification(Notification => {
		return Notification.permission === "granted"
	}, false)
}
this.notification_allowed = notificationAllowed;

function notificationRequestPermission(){
	withNotification(Notification => {
		Notification.requestPermission();
	})
}
this.notification_request_permission = notificationRequestPermission;

this.notification_show_short_text = function(text){
	if(!notificationAllowed()) {
		notificationRequestPermission();
	}else{
		withNotification(Notification => {
			var notification = new Notification(text, {body: text, requireInteraction: true});
			notification.onclick = function(event) {
				event.preventDefault(); // prevent the browser from focusing the Notification's tab
				GLang.callObject(GLang.dr.resolveName("show_message_async"), GLang.dr, [GLang.voidValue, GLang.stringValue(text)]);
				notification.close();
			}
		})
	}
}
this.notification_show_long_text = function(summary, full){
	if(!notificationAllowed()) {
		notificationRequestPermission();
	}else{
		withNotification(Notification => {
			var notification = new Notification(summary, {body: full, requireInteraction: true});
			notification.onclick = function(event) {
				event.preventDefault(); // prevent the browser from focusing the Notification's tab
				GLang.callObject(GLang.dr.resolveName("show_message_async"), GLang.dr, [GLang.voidValue, GLang.stringValue(full)]);
				notification.close();
			}
		})
	}
}

function withMotion(callback, onError){
	if(window.DeviceMotionEvent) {
		return callback(window.DeviceMotionEvent)
	}else{
		return onError;
	}
}
function withMotionPermissionStatus(callback) {
	withMotion(DeviceMotionEvent => {
		// feature detect
	    if (typeof DeviceMotionEvent.requestPermission === 'function') {
	      DeviceMotionEvent.requestPermission()
	        .then(permissionState => {
	        	callback(permissionState)
	        })
	        .catch(() => {
	        	callback("unknown")	
	        });
	    } else {
	      // handle regular non iOS 13+ devices
	      callback("granted")
	    }
	});
}

function motionSupported(){
	return withMotion(DeviceMotionEvent => {
		return true
	}, false)
}
this.motion_supported = motionSupported;

function motionAllowedAsync(callback){
	withMotionPermissionStatus(permission => {
		callback(permission === "granted")
	})
}
var motionAllowedAsyncKalzit = {value:function(env, args) {
	var callback = args[0];
	motionAllowedAsync(allowed => {
		GLang.callObject(callback, env, [
			{value:allowed ? 1 : 0}
		]);
	})
	return GLang.voidValue;
}};
GLang.dr.qdSet("motion_request_permission_async", motionAllowedAsyncKalzit);
GLang.dr.qdSet("motion_allowed_async", motionAllowedAsyncKalzit);

function motionForbiddenAsync(callback){
	withMotionPermissionStatus(permission => {
		callback(permission === "denied")
	})
}
GLang.dr.qdSet("motion_forbidden_async", {value:function(env, args) {
	var callback = args[0];
	motionForbiddenAsync(allowed => {
		GLang.callObject(callback, env, [
			{value:allowed ? 1 : 0}
		]);
	})
	return GLang.voidValue;
}});

function motionCanBeRequestedAsync(callback){
	withMotionPermissionStatus(permission => {
		callback(permission === "unknown")
	})
}
GLang.dr.qdSet("motion_can_be_requested_async", {value:function(env, args) {
	var callback = args[0];
	motionCanBeRequestedAsync(allowed => {
		GLang.callObject(callback, env, [
			{value:allowed ? 1 : 0}
		]);
	})
	return GLang.voidValue;
}});

//This implements actual shake detection
function setOnShake(then) {
	var threshold = 10;
	var direction = 1;
	var directionChanged = false;
	var count = 0;

	function onMotion(event) {
		var x = event.acceleration.x;
		if (x > 1 && direction < 1) {
			direction = -1;
			directionChanged = true;
		}
		if (x < 1 && direction > -1) {
			direction = 1;
			directionChanged = true;
		}
		
		//Count the number of shakes
		if (Math.abs(x) > threshold) {
			directionChanged = false;
			count++;
			if(count == 3) {
				//A shake happened !
				then();
			}
		}
		
	}
	
	//Reset the counter every second
	setInterval(function() {
		count = 0;
	}, 1000);
	
	window.addEventListener('devicemotion', onMotion);
}

GLang.dr.qdSet("on_global_shake", {value:function(env, args) {
	var callback = args[0];
	setOnShake(() => {
		GLang.callObject(callback, env, []);
	});
	return GLang.voidValue;
}});

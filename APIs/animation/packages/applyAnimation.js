function applyAnimation(env, args) {
	var _originalConfig = args[0];
	var _config = GLang.wrapValueToJsObject(_originalConfig);

	var element = _config.element;
	var duration = _config.duration;
	var name = _config.name;
	
	//console.log(_config);
	
	element.style.animationDuration = duration + "ms";
	element.style.animationFillMode = "both";
	if(_config.reverse) {
		element.style.animationDirection = "reverse";	
	} else {
		element.style.animationDirection = null;	
	}
	
	if(_config.onEnd) {
		element.onanimationend = function() {
			//Run " $onEnd propOf _config "
			var onEnd = GLang.callObject(GLang.eval("propOf"), env, [GLang.stringValue("onEnd"), _originalConfig])
			GLang.callObject(onEnd, env, [])
		}
	} else {
		element.onanimationend = null;	
	}
	
// 	//Make sure we trigger the animation
// 	setTimeout(function() {
// 		element.style.animationName = null;
// 		setTimeout(function() {
// 			element.style.animationName = name;
// 		}, 0)
// 	}, 0)
	
	element.style.animationName = name;

}

GLang.defaultRuntimeEnvironment.setInnerVariable("applyAnimation", {value:function(env, args) {
	applyAnimation(env, args);
	return GLang.voidValue;
}});
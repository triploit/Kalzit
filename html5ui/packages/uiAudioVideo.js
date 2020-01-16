;(function(global){
function makePlayerInterface(mediaElement){
	var onEnd = function(){};
	var onProgress = function(time){};
	mediaElement.addEventListener('ended',function myHandler(e) {
		onEnd();
    } ,false);
    mediaElement.addEventListener('timeupdate',function myHandler(e) {
		onProgress(mediaElement.currentTime);
    } ,false);

	var controller = {value:[
		{value:[{value:"play"}, {
			value: function(env, args){
				mediaElement.play();
				return GLang.voidValue;
			}, display: "function"
		}]},
		{value:[{value:"pause"}, {
			value: function(env, args){
				mediaElement.pause();
				return GLang.voidValue;
			}, display: "function"
		}]},
		{value:[{value:"setVolume"}, {
			value: function(env, args){
				mediaElement.volume = parseFloat(args[0].value + "");
				return GLang.voidValue;
			}, display: "function"
		}]},
		{value:[{value:"getVolume"}, {
			value: function(env, args){
				return {value:mediaElement.volume};
			}, display: "function"
		}]},
		{value:[{value:"getDuration"}, {
			value: function(env, args){
				return {value:mediaElement.duration};
			}, display: "function"
		}]},
		{value:[{value:"setTime"}, {
			value: function(env, args){
				mediaElement.currentTime = parseFloat(args[0].value + "");
				return GLang.voidValue;
			}, display: "function"
		}]},
		{value:[{value:"setOnEnd"}, {
			value: function(env, args){
				onEnd = function(){
					GLang.callObject(args[0], env, [controller]);
				}
				return GLang.voidValue;
			}, display: "function"
		}]},
		{value:[{value:"getProgress"}, {
			value: function(env, args){
				return {value:mediaElement.currentTime};
			}, display: "function"
		}]},
		{value:[{value:"setOnProgress"}, {
			value: function(env, args){
				onProgress = function(time){
					GLang.callObject(args[0], env, [{value:time}, controller]);
				}
				return GLang.voidValue;
			}, display: "function"
		}]}
	]};
	
	return controller
}

GLang.defaultRuntimeEnvironment.setInnerVariable("uiAudioPlayer", {value:function(env, args){
	var audio = document.createElement("audio");
	audio.classList.add("calcitAudioPlayer");
	audio.src = args[0].value;
	audio.controls = "controls";
	GLang.callObject((args.length >= 2 ? args[1] : GLang.stringValue("")), env, [makePlayerInterface(audio)]);
	return {value:audio, display:"dom"};
}, display:"function"});
GLang.defaultRuntimeEnvironment.setInnerVariable("uiVideoPlayer", {value:function(env, args){
	var video = document.createElement("video");
	video.classList.add("calcitAudioPlayer");
	video.src = args[0].value;
	video.controls = "controls";
	GLang.callObject((args.length >= 2 ? args[1] : GLang.stringValue("")), env, [makePlayerInterface(video)]);
	return {value:video, display:"dom"};
}, display:"function"});
})(this);
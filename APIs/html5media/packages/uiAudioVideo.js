;(function(global){
	
	/*
	This function is at the core of both "uiAudioPlayer" and "uiVideoPlayer".
	It takes the JavaScript representation of an "audio" or "video" element and creates a Kalzit MediaController from it.
	
	For more information about media controllers, take a look at the "MediaController" type.
	*/
	function makePlayerInterface(mediaElement){
		var onEnd = function(){};
		var onPlay = function(){};
		var onPause = function(){};
		var onProgress = function(time){};
		mediaElement.addEventListener('ended',function myHandler(e) {
			onEnd();
	    } ,false);
	    mediaElement.addEventListener('timeupdate',function myHandler(e) {
			onProgress(mediaElement.currentTime);
	    } ,false);
	   	mediaElement.addEventListener('playing',function myHandler(e) {
			onPlay();
	    } ,false);
	    mediaElement.addEventListener('pause',function myHandler(e) {
			onPause();
	    } ,false);
	
		var controller = {value:[
			{value:[{value:"isPaused"}, {
				value: function(env, args){
					return {value: mediaElement.paused ? 1 : 0};
				}, display: "function"
			}]},
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
			{value:[{value:"setOnPlay"}, {
				value: function(env, args){
					onPlay = function(){
						GLang.callObject(args[0], env, [controller]);
					}
					return GLang.voidValue;
				}, display: "function"
			}]},
			{value:[{value:"addOnPlay"}, {
				value: function(env, args){
					var oldOnPlay = onPlay;
					onPlay = function(){
						oldOnPlay();
						GLang.callObject(args[0], env, [controller]);
					}
					return GLang.voidValue;
				}, display: "function"
			}]},
			{value:[{value:"setOnPause"}, {
				value: function(env, args){
					onPause = function(){
						GLang.callObject(args[0], env, [controller]);
					}
					return GLang.voidValue;
				}, display: "function"
			}]},
			{value:[{value:"addOnPause"}, {
				value: function(env, args){
					var oldOnPause = onPause;
					onPause = function(){
						oldOnPause();
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
	
	/* @kalzit.for ui_audio_player
	Creates a media controller and a graphical representation of the audio (usually control buttons and a progress indicator) from any URL that points to an audio file.
	The function expects two parameters: The URL and a callback, which will be called when the media controller is ready.
	
	Usage example:
		```kalzit
		"anyAudioFileUrl" uiAudioPlayer ($_mediaController fun {
			`We can start playing now`
			play: _mediaController
		}).
		```
		
	For more information about media controllers, take a look at the "[MediaController](/services/documentation/MediaController)" type.
	*/
	GLang.defaultRuntimeEnvironment.setInnerVariable("uiAudioPlayer", {value:function(env, args){
		var audio = document.createElement("audio");
		audio.classList.add("calcitAudioPlayer");
		audio.src = args[0].value;
		audio.controls = "controls";
		if(args.length === 2) {
			GLang.callObject(args[1], env, [makePlayerInterface(audio)]);
		}
		return {value:audio, display:"dom"};
	}, display:"function"});
	
	GLang.defaultRuntimeEnvironment.setInnerVariable("audioPlayer", {value:function(env, args){
		var audio = new Audio(args[0].value);
		if(args.length === 2) {
			GLang.callObject(args[1], env, [makePlayerInterface(audio)]);
		}
		return {value:audio};
	}, display:"function"});
	
	/* @kalzit.for ui_video_player
	Creates a media controller and a graphical representation of the video (usually shows a frame of the video, control buttons and a progress indicator) from any URL that points to a video file.
	The function expects two parameters: The URL and a callback, which will be called when the media controller is ready.
	
	Usage example:
		```kalzit
		"anyVideoFileUrl" uiVideoPlayer ($_mediaController fun {
			`We can start playing now`
			play: _mediaController
		}).
		```
		
	For more information about media controllers, take a look at the "MediaController" type.
	*/
	GLang.defaultRuntimeEnvironment.setInnerVariable("uiVideoPlayer", {value:function(env, args){
		var video = document.createElement("video");
		video.classList.add("calcitVideoPlayer");
		video.src = args[0].value;
		video.controls = "controls";
		if(args.length === 2) {
			GLang.callObject(args[1], env, [makePlayerInterface(video)]);
		}
		return {value:video, display:"dom"};
	}, display:"function"});
})(this);

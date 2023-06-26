;(function(){
	var queue = [];
	var apiLoaded = false;
	var apiBooted = true;
	
	function runWithVimeoApi(fun){
		try{
			if(apiLoaded){
				fun();
			}else{
				queue.push(fun);
				if(!apiBooted){
					var scriptTag = document.createElement("script");
					scriptTag.src = "https://player.vimeo.com/api/player.js";
					scriptTag.onload = function(){
						apiLoaded = true;
						while(queue.length) queue.pop()();
					};
					document.head.appendChild(scriptTag);
					apiBooted = true;	
				}
			}
		}catch(e){
			//console.error("Dang, this might be why the vimeo player does not work:");
			console.error(e);
		}
	}
	
	function uiVimeoPlayer(video, playerCallback){
		var frame = document.createElement("iframe");
		frame.src='https://player.vimeo.com/video/' + video;
		frame.setAttribute("frameborder", 0);
		runWithVimeoApi(function(){
			playerCallback(new Vimeo.Player(frame))
		});
		return {display:DISPLAY_DOM, value:frame};
	}
	
	function playerValue(player){
		var onEnd = function(){};
		player.on("ended", function(data){
			onEnd();
		});
		var onProgress = function(time){};
		var lastTime = null;
		setInterval(function(){
			var newTime = player.getCurrentTime();
			if(lastTime !== newTime){
				onProgress(lastTime = newTime);
			}
		}, 100)
		
		var controller = {value:[
			{value:[{value:"play"}, {
				value: function(env, args){
					player.play();
					return GLang.voidValue;
				}, display: DISPLAY_FUNCTION
			}]},
			{value:[{value:"pause"}, {
				value: function(env, args){
					player.pause();
					return GLang.voidValue;
				}, display: DISPLAY_FUNCTION
			}]},
			{value:[{value:"getDuration"}, {
				value: function(env, args){
					return {value:player.getDuration()};
				}, display: DISPLAY_FUNCTION
			}]},
			{value:[{value:"setTime"}, {
				value: function(env, args){
					player.seek(parseInt(args[0].value + ""));
					return GLang.voidValue;
				}, display: DISPLAY_FUNCTION
			}]},
			{value:[{value:"setVolume"}, {
				value: function(env, args){
					player.setVolume(parseFloat(args[0].value + ""));
					return GLang.voidValue;
				}, display: DISPLAY_FUNCTION
			}]},
			{value:[{value:"getVolume"}, {
				value: function(env, args){
					return {value:player.getVolume()};
				}, display: DISPLAY_FUNCTION
			}]},
			{value:[{value:"setOnEnd"}, {
				value: function(env, args){
					onEnd = function(){
						GLang.callObject(args[0], env, [controller]);
					}
					return GLang.voidValue;
				}, display: DISPLAY_FUNCTION
			}]},
			{value:[{value:"getProgress"}, {
				value: function(env, args){
					return {value:player.getCurrentTime()};
				}, display: DISPLAY_FUNCTION
			}]},
			{value:[{value:"setOnProgress"}, {
				value: function(env, args){
					onProgress = function(time){
						GLang.callObject(args[0], env, [{value:time}, controller]);
					}
					return GLang.voidValue;
				}, display: DISPLAY_FUNCTION
			}]}
		]};
		
		 return controller
	}
	
	GLang.defaultRuntimeEnvironment.setInnerVariable("uiVimeoPlayer", {value:function(env, args){
		return uiVimeoPlayer(args[0].value, function(player){
			GLang.callObject(args.length >= 2 ? args[1] : {value:""}, env, [playerValue(player)])
		});
	}});
})();

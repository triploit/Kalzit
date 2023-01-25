;(function(){
	var queue = [];
	var apiLoaded = false;
	var apiBooted = false;
	
	function runWithTwitchApi(fun){
		try{
			if(apiLoaded){
				fun();
			}else{
				queue.push(fun);
				if(!apiBooted){
					var scriptTag = document.createElement("script");
					scriptTag.src = "https://player.twitch.tv/js/embed/v1.js";
					scriptTag.onload = function(){
						apiLoaded = true;
						while(queue.length) queue.pop()();
					};
					document.head.appendChild(scriptTag);
					apiBooted = true;
				}
			}
		}catch(e){
			console.error("Dang, this might be why the twitch player does not work:");
			console.error(e);
		}
	}
	
	function uiTwitchChannelPlayer(channel, playerCallback){
		var player = document.createElement("div");
		runWithTwitchApi(function(){
			playerCallback(new Twitch.Player(player, {
				channel: channel,
				width: "100%",
				height: "100%"
			}))
		});
		return {display:"dom", value:player};
	}
	function uiTwitchVideoPlayer(video, playerCallback){
		var player = document.createElement("div");
		runWithTwitchApi(function(){
			playerCallback(new Twitch.Player(player, {
				video: video,
				width: "100%",
				height: "100%"
			}))
		});
		return {display:"dom", value:player};
	}
	function uiTwitchCollectionPlayer(collection, playerCallback){
		var player = document.createElement("div");
		runWithTwitchApi(function(){
			playerCallback(new Twitch.Player(player, {
				collection: collection,
				width: "100%",
				height: "100%"
			}))
		});
		return {display:"dom", value:player};
	}
	
	function playerValue(player){
		var onEnd = function(){};
		player.addEventListener(Twitch.Player.ENDED, function(state){
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
				}, display: "function"
			}]},
			{value:[{value:"pause"}, {
				value: function(env, args){
					player.pause();
					return GLang.voidValue;
				}, display: "function"
			}]},
			{value:[{value:"getDuration"}, {
				value: function(env, args){
					return {value:player.getDuration()};
				}, display: "function"
			}]},
			{value:[{value:"setTime"}, {
				value: function(env, args){
					player.seek(parseInt(args[0].value + ""));
					return GLang.voidValue;
				}, display: "function"
			}]},
			{value:[{value:"setVolume"}, {
				value: function(env, args){
					player.setVolume(parseFloat(args[0].value + ""));
					return GLang.voidValue;
				}, display: "function"
			}]},
			{value:[{value:"getVolume"}, {
				value: function(env, args){
					return {value:player.getVolume()};
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
					return {value:player.getCurrentTime()};
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
		
		return controller;
	}
	
	/* @kalzit.for ui_twitch_channel_player
	Produces a UI element that displays the current stream of a Twitch channel.
	The element is produced by the Twitch JavaScript API, which is automatically loaded when you use a uiTwitchPlayer function.
	
	As with uiAudioPlayer and uiVideoPlayer, you can specify a callback to receive a media controller.
	
	Usage example:
	```
	`The simplest way`
	print: uiTwitchChannelPlayer: "channelName".
	
	`With a media controller`
	print: "channelName" uiTwitchChannelPlayer {play: x}.
	```
	*/
	GLang.defaultRuntimeEnvironment.setInnerVariable("uiTwitchChannelPlayer", {value:function(env, args){
		return uiTwitchChannelPlayer(args[0].value, function(player){
			GLang.callObject(args.length >= 2 ? args[1] : {value:""}, env, [playerValue(player)])
		});
	}});
	
	/* @kalzit.for ui_twitch_video_player
	Produces a UI element that displays specified Twitch video.
	The element is produced by the Twitch JavaScript API, which is automatically loaded when you use a uiTwitchPlayer function.
	
	As with uiAudioPlayer and uiVideoPlayer, you can specify a callback to receive a media controller.
	
	Usage example:
	```
	`The simplest way`
	print: uiTwitchVideoPlayer: "videoId".
	
	`With a media controller`
	print: "videoId" uiTwitchVideoPlayer {play: x}.
	```
	*/
	GLang.defaultRuntimeEnvironment.setInnerVariable("uiTwitchVideoPlayer", {value:function(env, args){
		return uiTwitchVideoPlayer(args[0].value, function(player){
			GLang.callObject(args.length >= 2 ? args[1] : {value:""}, env, [playerValue(player)])
		});
	}});
	
	/* @kalzit.for ui_twitch_collection_player
	Produces a UI element that displays the specified Twitch video collection.
	The element is produced by the Twitch JavaScript API, which is automatically loaded when you use a uiTwitchPlayer function.
	
	As with uiAudioPlayer and uiVideoPlayer, you can specify a callback to receive a media controller.
	
	Usage example:
	```
	`The simplest way`
	print: uiTwitchCollectionPlayer: "collectionId".
	
	`With a media controller`
	print: "collectionId" uiTwitchCollectionPlayer {play: x}.
	```
	*/
	GLang.defaultRuntimeEnvironment.setInnerVariable("uiTwitchCollectionPlayer", {value:function(env, args){
		return uiTwitchCollectionPlayer(args[0].value, function(player){
			GLang.callObject(args.length >= 2 ? args[1] : {value:""}, env, [playerValue(player)])
		});
	}});
})();
var queue = [];
var scriptTag = document.createElement("script");
var apiLoaded = false;
scriptTag.src = "https://player.twitch.tv/js/embed/v1.js";
scriptTag.onload = function(){
	apiLoaded = true;
	while(queue.length) queue.pop()();
};
document.head.appendChild(scriptTag);

function runWithTwitchApi(fun){
	try{
		if(apiLoaded){
			fun();
		}else{
			queue.push(fun);
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
	
	return {value:[
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
					GLang.callObject(args[0], env, []);
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
					GLang.callObject(args[0], env, [{value:time}]);
				}
				return GLang.voidValue;
			}, display: "function"
		}]}
	]}
}

GLang.defaultRuntimeEnvironment.setInnerVariable("uiTwitchChannelPlayer", {value:function(env, args){
	return uiTwitchChannelPlayer(args[0].value, function(player){
		GLang.callObject(args.length >= 2 ? args[1] : {value:""}, env, [playerValue(player)])
	});
}});
GLang.defaultRuntimeEnvironment.setInnerVariable("uiTwitchVideoPlayer", {value:function(env, args){
	return uiTwitchVideoPlayer(args[0].value, function(player){
		GLang.callObject(args.length >= 2 ? args[1] : {value:""}, env, [playerValue(player)])
	});
}});
GLang.defaultRuntimeEnvironment.setInnerVariable("uiTwitchCollectionPlayer", {value:function(env, args){
	return uiTwitchCollectionPlayer(args[0].value, function(player){
		GLang.callObject(args.length >= 2 ? args[1] : {value:""}, env, [playerValue(player)])
	});
}});
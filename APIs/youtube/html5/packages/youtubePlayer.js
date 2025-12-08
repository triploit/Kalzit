;(function(){
	// This is run when the API is ready
	var queue = [];
	var apiLoaded = false;
	var apiBooted = false;
	window.onYouTubePlayerAPIReady = function() {
		apiLoaded = true;
		while(queue.length){queue.pop()()};
	}
	
	function runWithYtApi(fun){
		if(apiLoaded){
			fun();
		}else{
			queue.push(fun);
			if(!apiBooted){
				// Load the IFrame Player API code asynchronously.
				var tag = document.createElement('script');
				tag.src = "https://www.youtube.com/player_api";
				var firstScriptTag = document.getElementsByTagName('script')[0];
				firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
				
				apiBooted = true;
			}
		}
	}
	
	function uiYoutubePlayer(id, playerCallback){
		var player = document.createElement("div");
		runWithYtApi(function(){
			playerCallback(new YT.Player(player, {
				videoId: id
			}));
		})
		return {display:DISPLAY_DOM, value:player};
	}
	
	function playerValue(player){
		var onEnd = function(){};
		player.addEventListener('onStateChange', function(state){
			switch(state.data){
				case YT.PlayerState.ENDED: onEnd(); break;	
			}
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
				value: function(args){
					player.playVideo();
					return GLang.voidValue;
				}, display: DISPLAY_FUNCTION
			}]},
			{value:[{value:"pause"}, {
				value: function(args){
					player.pauseVideo();
					return GLang.voidValue;
				}, display: DISPLAY_FUNCTION
			}]},
			{value:[{value:"getDuration"}, {
				value: function(args){
					return {value:player.getDuration()};
				}, display: DISPLAY_FUNCTION
			}]},
			{value:[{value:"setTime"}, {
				value: function(args){
					player.seekTo(parseInt(args[0].value + ""));
					return GLang.voidValue;
				}, display: DISPLAY_FUNCTION
			}]},
			{value:[{value:"setVolume"}, {
				value: function(args){
					player.setVolume(parseFloat(args[0].value + "") * 100);
					return GLang.voidValue;
				}, display: DISPLAY_FUNCTION
			}]},
			{value:[{value:"getVolume"}, {
				value: function(args){
					return {value:player.getVolume() / 100};
				}, display: DISPLAY_FUNCTION
			}]},
			{value:[{value:"setOnEnd"}, {
				value: function(args){
					onEnd = function(){
						GLang.call(args[0], [controller]);
					}
					return GLang.voidValue;
				}, display: DISPLAY_FUNCTION
			}]},
			{value:[{value:"getProgress"}, {
				value: function(args){
					return {value:player.getCurrentTime()};
				}, display: DISPLAY_FUNCTION
			}]},
			{value:[{value:"setOnProgress"}, {
				value: function(args){
					onProgress = function(time){
						GLang.call(args[0], [{value:time}, controller]);
					}
					return GLang.voidValue;
				}, display: DISPLAY_FUNCTION
			}]}
		]}
		
		return controller;
	}
	
	GLang.dr.qdSet("ui_native_youtube_player", {value:function(args){
		return uiYoutubePlayer(args[0].value, function(player){
			console.log(player);
			GLang.call(args.length >= 2 ? args[1] : {value:""}, [playerValue(player)])
		});
	}});
})();

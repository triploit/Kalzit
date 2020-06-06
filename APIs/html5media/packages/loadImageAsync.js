(function(){

	//The APIs for more complex image handling (more than just displaying) appear to be slow or broken, so they will be removed soon.
	function loadImageAndThen(imageUrl, andThen){
		var image = document.createElement("img");
		image.onload = function(){
			var width = image.width;
			var height = image.height;
			
			//Create a canvas to access pixel data
			var canvas = document.createElement("canvas");
			canvas.width = width;
			canvas.height = height;
			canvas.getContext('2d').drawImage(image, 0, 0, image.width, image.height);
			
			var pixels = canvas.getContext("2d").getImageData(0,0,width,height).data;
			andThen(pixels, width, height)
		}
		image.src="server/serverside_load.php?query=" + encodeURIComponent(imageUrl);
	}

	//The APIs for more complex image handling (more than just displaying) appear to be slow or broken, so they will be removed soon.
	GLang.defaultRuntimeEnvironment.setInnerVariable("loadImageAsync", {value:function(env, args){
		loadImageAndThen(args[1].value, function(pixels, width, height){
			var result = [];
			
			for(var x = 0; x < width; x++){
				result.push({value:[]});
				for(var y = 0; y < height; y++){
					var start = (y * width + x) * 4;
					result[x].value.push({value:[
						{value:pixels[start]},
						{value:pixels[start+1]},
						{value:pixels[start+2]},
						{value:pixels[start+3]}
					]});
				}
			}
			GLang.callObject(args[0], env, [{value:result}]);
		})
		
		return {value:0, display:"none"};
	}, display:"function"});
	
	//The APIs for more complex image handling (more than just displaying) appear to be slow or broken, so they will be removed soon.
	GLang.defaultRuntimeEnvironment.setInnerVariable("loadImageAsyncRgb", {value:function(env, args){
		loadImageAndThen(args[1].value, function(pixels, width, height){
			var result = [];
			
			for(var x = 0; x < width; x++){
				result.push({value:[]});
				for(var y = 0; y < height; y++){
					var start = (y * width + x) * 4;
					result[x].value.push({value:[
						{value:pixels[start]},
						{value:pixels[start+1]},
						{value:pixels[start+2]}
					]});
				}
			}
			GLang.callObject(args[0], env, [{value:result}]);
		})
		
		return {value:0, display:"none"};
	}, display:"function"});
	
	//The APIs for more complex image handling (more than just displaying) appear to be slow or broken, so they will be removed soon.
	GLang.defaultRuntimeEnvironment.setInnerVariable("loadImageAsyncMono", {value:function(env, args){
		loadImageAndThen(args[1].value, function(pixels, width, height){
			var result = [];
			
			for(var x = 0; x < width; x++){
				result.push({value:[]});
				for(var y = 0; y < height; y++){
					var start = (y * width + x) * 4;
					result[x].value.push({value:(pixels[start] + pixels[start+1] + pixels[start+2]) / 3});
				}
			}
			GLang.callObject(args[0], env, [{value:result}]);
		})
		
		return {value:0, display:"none"};
	}, display:"function"});
})();
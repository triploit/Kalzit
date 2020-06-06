//The APIs for more complex image handling (more than just displaying) appear to be slow or broken, so they will be removed soon.
GLang.defaultRuntimeEnvironment.setInnerVariable("uiShowImageDataChannelsRgb", {value:function(env, args){
	var canvas = document.createElement("canvas");
	
	var channels=args[1].value;
	var redChannel=channels[0].value;
	var greenChannel=channels[1].value;
	var blueChannel=channels[2].value;
	
	var width, height;
	if(redChannel instanceof Array){
		width=redChannel.length;
		height=redChannel[0].value.length;
	}else if(greenChannel instanceof Array){
		width=greenChannel.length;
		height=greenChannel[0].value.length;
	}else if(blueChannel instanceof Array){
		width=blueChannel.length;
		height=blueChannel[0].value.length;
	}
	var imageData = canvas.getContext("2d").createImageData(width, height);

	for(var y = 0; y < imageData.height; y++){
		for(var x = 0; x < imageData.width; x++){
			for(var i = 0; i < 4; i++){
				var index = (imageData.width * y + x) * 4 + i;
				switch(i){
					case 0: imageData.data[index] = GLang.at(y, GLang.at(x, redChannel)).value; break;
					case 1: imageData.data[index] = GLang.at(y, GLang.at(x, greenChannel)).value; break;
					case 2: imageData.data[index] = GLang.at(y, GLang.at(x, blueChannel)).value; break;
					case 3: 
						imageData.data[index] = GLang.callObject(args[0], env, [{value:[
							imageData.data[index-3],
							imageData.data[index-2],
							imageData.data[index-1]
						]}]).value;
				}
			}
		}
	}
	
	canvas.width = imageData.width;
	canvas.height = imageData.height;
	canvas.getContext("2d").putImageData(imageData,0,0);
	
	return {value:canvas, display:"dom"};
}, display:"function"});

//The APIs for more complex image handling (more than just displaying) appear to be slow or broken, so they will be removed soon.
GLang.defaultRuntimeEnvironment.setInnerVariable("uiShowImageDataChannels", {value:function(env, args){
	var canvas = document.createElement("canvas");
	
	var channels=args[0].value;
	var redChannel=channels[0].value;
	var greenChannel=channels[1].value;
	var blueChannel=channels[2].value;
	var alphaChannel=channels[3].value;
	
	var width, height;
	if(redChannel instanceof Array){
		width=redChannel.length;
		height=redChannel[0].value.length;
	}else if(greenChannel instanceof Array){
		width=greenChannel.length;
		height=greenChannel[0].value.length;
	}else if(blueChannel instanceof Array){
		width=blueChannel.length;
		height=blueChannel[0].value.length;
	}else if(alphaChannel instanceof Array){
		width=alphaChannel.length;
		height=alphaChannel[0].value.length;
	}
	var imageData = canvas.getContext("2d").createImageData(width, height);

	for(var y = 0; y < imageData.height; y++){
		for(var x = 0; x < imageData.width; x++){
			for(var i = 0; i < 4; i++){
				var index = (imageData.width * y + x) * 4 + i;
				switch(i){
					case 0: imageData.data[index] = GLang.at(y, GLang.at(x, redChannel)).value; break;
					case 1: imageData.data[index] = GLang.at(y, GLang.at(x, greenChannel)).value; break;
					case 2: imageData.data[index] = GLang.at(y, GLang.at(x, blueChannel)).value; break;
					case 3: imageData.data[index] = GLang.at(y, GLang.at(x, alphaChannel)).value; break;
				}
			}
		}
	}
	
	canvas.width = imageData.width;
	canvas.height = imageData.height;
	canvas.getContext("2d").putImageData(imageData,0,0);
	
	return {value:canvas, display:"dom"};
}, display:"function"});
(function(){
	
	function makeRgbaImageData(canvas, env, args){
		var imageData = canvas.getContext("2d").createImageData(args[0].value.length, args[0].value[0].value.length);
	
		for(var y = 0; y < imageData.height; y++){
			for(var x = 0; x < imageData.width; x++){
				for(var i = 0; i < 4; i++){
					imageData.data[(imageData.width * y + x) * 4 + i] = args[0].value[x].value[y].value[i].value
				}
			}
		}
		
		return imageData;
	}
	
	function makeRgbImageData(canvas, env, args){
		var imageData = canvas.getContext("2d").createImageData(args[1].value.length, args[1].value[0].value.length);
	
		for(var y = 0; y < imageData.height; y++){
			for(var x = 0; x < imageData.width; x++){
				for(var i = 0; i < 4; i++){
					var index = (imageData.width * y + x) * 4 + i;
					if(i === 3){
						imageData.data[index] = GLang.callObject(args[0], env, [{value:[
							imageData.data[index-3],
							imageData.data[index-2],
							imageData.data[index-1]
						]}]).value;
						continue;
					}
					imageData.data[index] = args[1].value[x].value[y].value[i].value
				}
			}
		}
		
		return imageData;
	}
	
	function makeMonoImageData(canvas, env, args){
		var imageData = canvas.getContext("2d").createImageData(args[1].value.length, args[1].value[0].value.length);
	
		for(var y = 0; y < imageData.height; y++){
			for(var x = 0; x < imageData.width; x++){
				var index = (imageData.width * y + x) * 4;
				imageData.data[index] = imageData.data[index+1] = imageData.data[index+2] = args[1].value[x].value[y].value
				imageData.data[index+3] = GLang.callObject(args[0], env, [{value:imageData.data[index]}]).value;
			}
		}
		
		return imageData;
	}
	
	function makeDataCanvas(dataMaker, env, args){
		var canvas = document.createElement("canvas");
		var imageData = dataMaker(canvas, env, args);
		canvas.width = imageData.width;
		canvas.height = imageData.height;
		canvas.getContext("2d").putImageData(imageData,0,0);
		return canvas;
	}
	
	var windowLoaded = false;
	window.addEventListener('load', function(){
		windowLoaded = true;
	}, false);
	
	
	var refreshImages = true;
	function scrollStateChanged(){
		var result = refreshImages;
		refreshImages = false;
		return result;
	}
	window.addEventListener('scroll', function(){
		refreshImages = true;
	});
	window.addEventListener('resize', function(){
		refreshImages = true;
	});
	
	//https://stackoverflow.com/questions/487073/how-to-check-if-element-is-visible-after-scrolling
	function isScrolledIntoView(el) {
	    var rect = el.getBoundingClientRect();
	    var elemTop = rect.top;
	    var elemBottom = rect.bottom;
	
	     // Partially visible elements return true:
	    isVisible = (elemTop - 100) < window.innerHeight && elemBottom >= -100;
	    return isVisible;
	}
	
	var urlViews = [];
	function urlView(url){
		var image = document.createElement("img");
		image.classList.add("calcitImage");
		
		if(!windowLoaded){
			//Idea: http://blog.dynamicdrive.com/5-brilliant-ways-to-lazy-load-images-for-faster-page-loads/
			window.addEventListener('load', function(){
				urlViews.push({url:url, view:image});
				refreshImages = true;
			}, false);
		}else{
			urlViews.push({url:url, view:image});
			refreshImages = true;
		}
		
		return image;
	}
	
	setInterval(function(){
		if(!scrollStateChanged()) return;
		for(var i = 0; i < urlViews.length; i++){
			var view = urlViews[i];
			var hasAttrib = view.view.hasAttribute("src");
			var visible = isScrolledIntoView(view.view);
			if(visible && !hasAttrib){
				view.view.setAttribute("src", view.url);
			}else if(hasAttrib && !visible){
				view.view.removeAttribute("src");
			}
		}
	}, 100);
	
	GLang.defaultRuntimeEnvironment.setInnerVariable("uiShowImageUrl", {value:GLang.arrayFun(function(env, args){
		var image = urlView(args[0].value);
		return {value:image, display:"dom"};
	}), display:"function"});
	
	GLang.defaultRuntimeEnvironment.setInnerVariable("uiShowScaledImageUrl", {value:function(env, args){
		var image = urlView(args[1].value);
		image.style.width = args[0].value[0].value + "px";
		image.style.height = args[0].value[1].value + "px";
		return {value:image, display:"dom"};
	}, display:"function"});
	
	GLang.defaultRuntimeEnvironment.setInnerVariable("uiShowScaledAndRoundedImageUrl", {value:function(env, args){
		var image = urlView(args[1].value);
		image.style.width = args[0].value[0].value + "px";
		image.style.height = args[0].value[1].value + "px";
		image.style.borderRadius = 10 + "px";
		return {value:image, display:"dom"};
	}, display:"function"});
	
	GLang.defaultRuntimeEnvironment.setInnerVariable("uiImageButton", {value:GLang.arrayFun(function(env, args){
		var image = document.createElement("img");
		image.src = args[1].value;
		image.classList.add("calcitImage");
		image.classList.add("k-image_button");
		image.onclick = function(){
			setTimeout(function(){
				GLang.callObject(args[0], env, []);
			}, 100);
		};
		return {value:image, display:"dom"};
	}), display:"function"});
	
	GLang.defaultRuntimeEnvironment.setInnerVariable("uiShowImageDataArray", {value:function(env, args){
		var canvas = document.createElement("canvas");
		var imageData = canvas.getContext("2d").createImageData(args[0].value[0].value, args[0].value[1].value);
	
		for(var i = 0; i < args[1].value.length; i++){
			imageData.data[i] = args[1].value[i].value;
		}
		
		canvas.width = imageData.width;
		canvas.height = imageData.height;
		canvas.putImageData(0,0,imageData);
		
		return {value:canvas, display:"dom"};
	}, display:"function"});
	
	GLang.defaultRuntimeEnvironment.setInnerVariable("uiShowImageDataMatrix", {value:function(env, args){
		return {value:makeDataCanvas(makeRgbaImageData, env, args), display:"dom"};
	}, display:"function"});
	
	GLang.defaultRuntimeEnvironment.setInnerVariable("uiShowImageDataMatrixRgb", {value:function(env, args){
		return {value:makeDataCanvas(makeRgbImageData, env, args), display:"dom"};
	}, display:"function"});
	
	GLang.defaultRuntimeEnvironment.setInnerVariable("uiShowImageDataMatrixMono", {value:function(env, args){
		return {value:makeDataCanvas(makeMonoImageData, env, args), display:"dom"};
	}, display:"function"});
	
	
	GLang.defaultRuntimeEnvironment.setInnerVariable("imageDataUrl", {value:function(env, args){
		return GLang.stringValue(makeDataCanvas(makeRgbaImageData, env, args).toDataURL());
	}, display:"function"});
	
	GLang.defaultRuntimeEnvironment.setInnerVariable("imageDataUrlRgb", {value:function(env, args){
		return GLang.stringValue(makeDataCanvas(makeRgbImageData, env, args).toDataURL());
	}, display:"function"});
	
	GLang.defaultRuntimeEnvironment.setInnerVariable("imageDataUrlMono", {value:function(env, args){
		return GLang.stringValue(makeDataCanvas(makeMonoImageData, env, args).toDataURL());
	}, display:"function"});
	
})()
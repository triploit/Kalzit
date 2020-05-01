(function(){
	
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
	
})()
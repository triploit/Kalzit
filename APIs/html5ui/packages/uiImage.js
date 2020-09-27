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
	    isVisibleVertical = (elemTop - 100) < window.innerHeight && elemBottom >= -100;
	    
	   	var elemLeft = rect.left;
	    var elemRight = rect.right;
	
	     // Partially visible elements return true:
	    isVisible = isVisibleVertical && (elemLeft - 100) < window.innerWidth && elemRight >= -100;
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
	
	function refresh() {
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
	}
	
	setInterval(function(){
		refresh();
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
		image.classList.add("k-rounded");
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
		//Idea from https://www.w3schools.com/howto/howto_js_trigger_button_enter.asp
		image.addEventListener("keyup", function(event) {
			// Number 13 is the "Enter" key on the keyboard
			if (event.keyCode === 13) {
				// Cancel the default action, if needed
				event.preventDefault();
				// Trigger the main action
				setTimeout(function(){
					GLang.callObject(args[0], env, []);
				}, 100);
			}
		});
		image.setAttribute("tabindex", 0);
		return {value:image, display:"dom"};
	}), display:"function"});
	
})()
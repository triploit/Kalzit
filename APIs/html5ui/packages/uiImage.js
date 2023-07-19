var windowLoaded = false;
window.addEventListener('load', function(){
	windowLoaded = true;
}, false);

function isScrolledIntoView(element) {
	//TODO: This function does not check if the element is hidden because one of its containers scrolls
	//This is a problem with scaling popups; they start so small that all the elements appear to be on screen

    //We have to check if "element" is inside the viewport
    //But before we do that, check if the element even takes up any space right now
    //If it does not, that can maybe mess this up
    if (!(element.offsetWidth > 0 || element.offsetHeight > 0)) return false;
    
    //Get the bounds of "element" relative to the viewport
    var elementBounds = element.getBoundingClientRect();
    
    //Figure out how large the browser window is - basically the bounds of the currently visible content
    var windowHeight = window.innerHeight;
    var windowWidth = window.innerWidth;
    
    //For a better UX: how many pixels away from the currently visible content should the element be before being "scrolled into view"
    //If this number is larger, the user does not notice the lazy loading as much, because it happens outside of the visible area. This can cause unneeded overhead.
    var minimumDistance = 200;
    
    //Check if the element bounds are outside the visible part of the window
    //The "or" operator was chosen because it avoids if statements, but it also allows the evaluation to terminate when the first of the four expressions is true - meaning the element is guaranteed to be outside of the view
    var isOutsideView =
        //Bottom
    	(elementBounds.bottom < -minimumDistance) ||
    	//Top
    	(elementBounds.top > windowHeight + minimumDistance) ||
    	//Right
    	(elementBounds.right < -minimumDistance) ||
    	//Left
    	(elementBounds.left > windowWidth + minimumDistance);
    	
    //This function has to return if the element is INSIDE the view, so we have to negate "isOutsideView" and return it
    return !isOutsideView;
}

var urlViews = [];
function urlView(url, onLoad){
	var image = document.createElement("img");
	image.classList.add("calcitImage");
	
	if (onLoad !== undefined) {
		//We do not use lazy loading, but we want to be notified when loading is done
		image.addEventListener("load", function(){
			onLoad();
		})
		
		//If we have a load listener, set the "src" attribute immediately so we can load things in the background
		image.setAttribute("src", url);
	} else {
		//We use lazy loading
		
		//This function uses lazy loading; images are only loaded if they become visible
		//The actual lazy loading is managed by the refresh() function below. In here, we just register views for lazy loading
//		//We can be certain that the window is ready
//		if (windowLoaded){
//			//The window is ready - add this view to the "urlViews" array
			urlViews.push({url, view: image});
//		} else {
//			//The window is NOT ready - register a window event listener to tell when it becomes ready
//			window.addEventListener('load', function(){
//				//The window is ready now - add this view to "urlViews"
//				urlViews.push({url, view: image});
//			}, false);
//		}
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
			//TODO: Since we no longer do unloading, we can remove the current item from the urlViews array
		}
// 		else if(hasAttrib && !visible){
// 			//Image "unloading" is turned off for now, because it does not seem to matter for memory usage, and it made scrolling glitchy in Firefox
// 			view.view.removeAttribute("src");
// 		}
	}
}

setInterval(function(){
	refresh();
}, 100);

GLang.defaultRuntimeEnvironment.qdSet("ui_show_image_url", {value:GLang.arrayFun(function(env, args){
	var callback = args.length >= 2 ? args[1] : GLang.voidValue;
	var image = urlView(args[0].value, callback === GLang.voidValue ? undefined :  () => {
		//The image is loaded now
		GLang.callObject(callback, env, [{value:image, display:DISPLAY_DOM}]);
	});
	return {value:image, display:DISPLAY_DOM};
}), display:DISPLAY_FUNCTION});

GLang.defaultRuntimeEnvironment.qdSet("ui_show_image_url_directly", {value:GLang.arrayFun(function(env, args){
	var callback = args.length >= 2 ? args[1] : GLang.voidValue;
	var image = urlView(args[0].value, () => {
		//The image is loaded now
		GLang.callObject(callback, env, [{value:image, display:DISPLAY_DOM}]);
	});
	return {value:image, display:DISPLAY_DOM};
}), display:DISPLAY_FUNCTION});

GLang.defaultRuntimeEnvironment.qdSet("get_image_width", {value:GLang.arrayFun(function(env, args){
	var image = args[0].value;
	return {value:image.naturalWidth};
}), display:DISPLAY_FUNCTION});
GLang.defaultRuntimeEnvironment.qdSet("get_image_height", {value:GLang.arrayFun(function(env, args){
	var image = args[0].value;
	return {value:image.naturalHeight};
}), display:DISPLAY_FUNCTION});

GLang.defaultRuntimeEnvironment.qdSet("scale_image_to_url", {value:GLang.arrayFun(function(env, args){
	var factor = args[0].value;
	var image = args[1].value;
	
	//Create a canvas
	var canvas = document.createElement("canvas");
	//Calculate the new image size
	var width = image.naturalWidth * factor;
	var height = image.naturalHeight * factor;
	//Resize the canvas accordingly
	canvas.width = width;
	canvas.height = height;
	//Draw the image to the canvas
	canvas.getContext("2d").drawImage(image, 0, 0, width, height);
	
	//Produce a data URL from the drawn graphic
	return GLang.stringValue(canvas.toDataURL());
}), display:DISPLAY_FUNCTION});

GLang.defaultRuntimeEnvironment.qdSet("ui_image_button", {value:GLang.arrayFun(function(env, args){
	//We need to trigger the same button action in multiple different situations, so it makes sense to isolate it as a function
	function triggerAction() {
		GLang.callObject(args[0], env, []);
	}
	
	var image = document.createElement("img");
	image.src = args[1].value;
	image.classList.add("calcitImage");
	image.classList.add("k-image_button");
	image.onclick = function(){
		triggerAction();
	};
	
	//Call the same function that is triggered when the user clicks when "enter" is pressed
	image.onkeypress = function(event) {
		//13 is the ASCII code for "carriage return" - the enter key
		if(event.keyCode === 13) {
			triggerAction()
		}
	}
	
	image.setAttribute("tabindex", 0);
	return {value:image, display:DISPLAY_DOM};
}), display:DISPLAY_FUNCTION});

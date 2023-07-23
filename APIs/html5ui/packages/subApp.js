var hashes = new Map();
var lastSubApp = null;

var mainPageScrollingDisabled = false;
var mainPageScrollingShouldBeDisabled = false;

//This API includes a way of enabling and disabling page scrolling
//The main idea for that was found here: https://css-tricks.com/prevent-page-scrolling-when-a-modal-is-open/
//According to this page, it is OK to use code from that website anywhere: https://css-tricks.com/license/
//By the way, check out https://css-tricks.com - it is a great site

function disableScrolling() {
	//We need to disable scrolling without having the page jump
	//The main trick is "document.body.style.position" as "fixed", but that jumps the page
	//To counter-act the jumping, we have to save the original scroll position and apply it again later
	var originalScrollPosition = window.scrollY;
	
	//Prevent scrolling
	document.body.style.position = "fixed";
	
	//Jump the page to the correct location
	const scrollY = window.scrollY;
	document.body.style.top = -originalScrollPosition + "px";
	
	//The fixed styling messes with some other styling, which we have to counter-act again...
	document.body.style.width = "calc(100% - 14px)";
	document.body.style.height = "calc(100% - 14px)";
	
	//This line makes sure that scrolling will be re-enabled when any open sub-app is closed (managed by "window.onhashchange" below)
	mainPageScrollingDisabled = true;
}
this.disable_scrolling = function() {
	disableScrolling();
	//Make sure the scrolling stays disabled after a sub-app is closed - that normally re-enables scrolling
	mainPageScrollingShouldBeDisabled = true;
}

function enableScrolling() {
	//Here we go - we have to re-enable scrolling
	//Once again, we have to counter-act page jumping, so we need to get the current scroll position
	//window.scrollY does not work here, but the disableScrolling() function set the document.body.style.top property to the negative previous scroll position - with a "px" attached
	//We have to now undo that to figure out the original scroll potition. parseInt can actually remove the "px" for us without a problem
	var originalScrollPosition = -parseInt(document.body.style.top);
	
	//Reset the changed page styling properties to their original values
	document.body.style.position = "";
	document.body.style.top = "";
	
	//Since scrolling is re-enabled now, we should set the appropriate variable
	mainPageScrollingDisabled = false;
	
	//We still have to undo the page jumping.
	//parseInt can return NaN when the parsed string is empty. Happens when this function is called without disableScrolling() before it. Handle this case by just doing nothing
	if(!originalScrollPosition) return;
	
	//Scroll the page to the appropriate location - counter-acts jumping
	//window.scrollTo requires two parameters, by the way - second one is for the vertical position
	window.scrollTo(0, originalScrollPosition);
}

function initiate(name){
	if(hashes.has(lastSubApp)){
		//Close the sub app
		GLang.callObject(hashes.get(lastSubApp).close, GLang.dr, []);
	}
	if(hashes.has(name)){
		GLang.callObject(hashes.get(name).open, GLang.dr, []);
		
		//If it is not done already, disable scrolling of the main page content
		if(!mainPageScrollingDisabled) {
			disableScrolling();
		}
	}
	lastSubApp = name;
}

window.onhashchange = function(){
	if(GLANG_DEBUG) console.log(hashes);
	
	var hash = location.hash.replace("#", "");
	switch(hash) {
		case "none":
		case "":
			//Here we go - we have to re-enable scrolling
			const scrollY = document.body.style.top;
			
			GLang.dr.resolveName("popup_animate_out").value(GLang.dr, []);
			//If it is not done already, re-enable scrolling of the main page content
			if(mainPageScrollingDisabled && !mainPageScrollingShouldBeDisabled) {
				enableScrolling()
			}
	}
	initiate(hash);
}

var openSubApp = function(name) {
	location.hash = name;
};
this.open_sub_app = openSubApp;

this.close_sub_app = function() {
	location.hash = "#none";
};

var keepInitial = false;
this.sub_app_keep_initial = function() {
	keepInitial = true;
};
this.register_sub_app = function(name, _openAndClose){
	hashes.set(name, {open:_openAndClose[0], close:_openAndClose[1]});
	
	if(location.hash == "#" + name) {
		location.hash = "none";
		if(keepInitial) {
			//Open the sub-app again after closing it
			location.hash = name
		}
	}
};
this.get_current_sub_app = function(){
	return location.hash.replace("#", "");	
};

//Make sure that the sub-app is closed when the user hits escape
window.addEventListener("keydown", function(event){
	if("Escape" === event.key) {
		location.hash = "#none";
	}
})

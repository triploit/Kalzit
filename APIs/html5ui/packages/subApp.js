var hashes = new Map();
var lastSubApp = null;

//Idea for how to disable page scrolling is from: https://css-tricks.com/prevent-page-scrolling-when-a-modal-is-open/
var mainPageScrollingDisabled = false;
var mainPageScrollingShouldBeDisabled = false;

function disableScrolling() {
	const scrollY = window.scrollY;
	document.body.style.position = 'fixed';
	document.body.style.top = -scrollY + "px";
	document.body.style.width = "calc(100% - 14px)";
	document.body.style.height = "calc(100% - 14px)";
	mainPageScrollingDisabled = true;
}
this.disableScrolling = function() {
	disableScrolling();
	mainPageScrollingShouldBeDisabled = true;
}

function initiate(name){
	if(hashes.has(lastSubApp)){
		//Close the sub app
		GLang.callObject(hashes.get(lastSubApp).close, GLang.defaultRuntimeEnvironment, []);
	}
	if(hashes.has(name)){
		GLang.callObject(hashes.get(name).open, GLang.defaultRuntimeEnvironment, []);
		
		//If it is not done already, disable scrolling of the main page content
		if(!mainPageScrollingDisabled) {
			disableScrolling();
		}
	}
	lastSubApp = name;
}

window.onhashchange = function(){
	console.log(hashes);
	var hash = location.hash.replace("#", "");
	switch(hash) {
		case "none":
		case "":
			const scrollY = document.body.style.top;
			GLang.eval("!popupAnimateOut");
			//If it is not done already, re-enable scrolling of the main page content
			if(mainPageScrollingDisabled && !mainPageScrollingShouldBeDisabled) {
				document.body.style.position = '';
				document.body.style.top = '';
				window.scrollTo(0, parseInt(scrollY || '0') * -1);
				mainPageScrollingDisabled = false;
			}
	}
	initiate(hash);
}

this.openSubApp = function(name) {
	location.hash = name;
};
this.closeSubApp = function() {
	location.hash = "#none";
};

var keepInitial = false;
this.subAppKeepInitial = function() {
	keepInitial = true;
};
this.registerSubApp = function(name, _openAndClose){
	hashes.set(name, {open:_openAndClose[0], close:_openAndClose[1]});
	if(location.hash == "#" + name && !keepInitial) location.hash = "none"
};
this.getCurrentSubApp = function(){
	return location.hash.replace("#", "");	
};

//Make sure that the sub-app is closed when the user hits escape
window.addEventListener("keydown", function(event){
	if("Escape" === event.key) {
		location.hash = "#none";
	}
})
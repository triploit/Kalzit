this.setActiveAppName = function(id, title){
	history.pushState("", "", "/app/" + id);
	if(title){
		document.title = title;
	}
}
this.uiTitle = function(title){
	document.title = title;
}
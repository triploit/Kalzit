//Deprecated: clearing the app container should not be needed; you should probably re-architect your app, using things like "viewBasedAppManager".
this.ui_clear_app_container = function(){
	var playground = document.getElementById("playground");
	while (playground.hasChildNodes()) {
	    playground.removeChild(playground.lastChild);
	}
}

this.uiClearAppContainer = function(){
	var playground = document.getElementById("playground");
	while (playground.hasChildNodes()) {
	    playground.removeChild(playground.lastChild);
	}
}
this.isPopupActive = function(){
	return document.body.getElementsByClassName("k-popup").length >= 1;
}

this.hideAllPopups = function(){
	var popups = document.body.getElementsByClassName("k-popup_container");
	for(var i = 0; i < popups.length; i++) {
		popups[i].parentNode.removeChild(popups[i]);	
	}
}

this.popupAnimateOut = function(){
	var popups = document.getElementsByClassName("k-popup_container");
	if(popups.length == 1) {
		//Trigger animation and remove from DOM after a few seconds
		popups[0].classList.remove("k-popup_animated_in");
		setTimeout(function(){
			setTimeout(function(){
				popups[0].parentElement.removeChild(popups[0]);
			}, 500);
			popups[0].classList.add("k-popup_animated_out");
		}, 1);
	}
}
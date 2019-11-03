this.flagBottom = function(uselessArg, object){
	object.style.position = "absolute";
	object.style.bottom = "0";
}
this.flagTop = function(uselessArg, object){
	object.style.position = "absolute";
	object.style.top = "0";
}
this.flagLeft = function(uselessArg, object){
	object.style.position = "absolute";
	object.style.left = "0";
}
this.flagRight = function(uselessArg, object){
	object.style.position = "absolute";
	object.style.right = "0";
}
this.flagCenter = function(uselessArg, object){
	object.style.display = "block";
	object.style.position = "absolute";
	object.style.left = "50%";
	object.style.top = "50%";
	object.style.transform = ("translate(-50%, -50%)");
}
this.flagHorizontalCenter = function(uselessArg, object){
	object.style.display = "block";
	object.style.left = "50%";
	object.style.transform = ("translateX(-50%)");
}
this.flagVerticalCenter = function(uselessArg, object){
	object.style.display = "block";
	object.style.top = "50%";
	object.style.transform = ("translateY(-50%)");
}

this.flagWindowBottom = function(uselessArg, object){
	object.style.position = "fixed";
	object.style.bottom = "0";
}
this.flagWindowTop = function(uselessArg, object){
	object.style.position = "fixed";
	object.style.top = "0";
}
this.flagWindowLeft = function(uselessArg, object){
	object.style.position = "fixed";
	object.style.left = "0";
}
this.flagWindowRight = function(uselessArg, object){
	object.style.position = "fixed";
	object.style.right = "0";
}
this.flagWindowCenter = function(uselessArg, object){
	object.style.display = "block";
	object.style.position = "fixed";
	object.style.left = "50%";
	object.style.top = "50%";
	object.style.transform = ("translate(-50%, -50%)");
}
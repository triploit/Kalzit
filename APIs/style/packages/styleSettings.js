var manualDarkMode = false;
var manualHighContrastMode = false;

this.styleDarkModeAuto = function() {
	manualDarkMode = false;
	document.getElementById("k-style_dark").media = "(prefers-color-scheme: dark)";
	updateHighContrastDark();
}
this.styleDarkModeOn = function() {
	manualDarkMode = true;
	document.getElementById("k-style_dark").media = "all";
	updateHighContrastDark();
}
this.styleDarkModeOff = function() {
	manualDarkMode = false;
	document.getElementById("k-style_dark").media = "none";
	document.getElementById("k-style_highcontrast_dark").media = "none";
}

this.styleHighContrastAuto = function() {
	manualHighContrastMode = false;
	document.getElementById("k-style_highcontrast").media = "(prefers-contrast: more)";
	updateHighContrastDark();
}
this.styleHighContrastOn = function() {
	manualHighContrastMode = true;
	document.getElementById("k-style_highcontrast").media = "all";
	updateHighContrastDark();
}
this.styleHighContrastOff = function() {
	manualHighContrastMode = false;
	document.getElementById("k-style_highcontrast").media = "none";
	document.getElementById("k-style_highcontrast_dark").media = "none";
}

function updateHighContrastDark() {
	//The media tag of k-style_highcontrast_dark is the combination of k-style_highcontrast and k-style_dark
	var highContrastDarkTag = document.getElementById("k-style_highcontrast_dark");
	
	var highContrastMedia = document.getElementById("k-style_highcontrast").media;
	var darkModeMedia = document.getElementById("k-style_dark").media;
	
	if(highContrastMedia == "all") {
		highContrastDarkTag.media = darkModeMedia;
		return;
	} else if (darkModeMedia == "all") {
		highContrastDarkTag.media = highContrastMedia;
		return;
	}
	
	highContrastDarkTag.media = highContrastMedia + " and " + darkModeMedia;
}
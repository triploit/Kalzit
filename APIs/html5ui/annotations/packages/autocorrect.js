this.flagAutocorrect = function(trueOrFalse, view) {
	view.setAttribute("spellcheck", trueOrFalse ? "true" : "false");
	view.setAttribute("autocorrect", trueOrFalse ? "on" : "off");
	view.setAttribute("autocapitalize", trueOrFalse ? "on" : "off");
}
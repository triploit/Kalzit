this.set_sidebar_content_width = function(pxWidth) {
	document.documentElement.style.setProperty("--kv-sidebar_content_width", Math.max(pxWidth,0) + "px");
}

this.collapse_sidebar = function() {
	document.body.classList.add("k-sidebar_hidden");
}

this.expand_sidebar = function() {
	document.body.classList.remove("k-sidebar_hidden");
}

this.toggle_sidebar_expansion = function() {
	document.body.classList.toggle("k-sidebar_hidden");
}

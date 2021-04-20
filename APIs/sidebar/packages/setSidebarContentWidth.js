this.setSidebarContentWidth = function(pxWidth) {
	document.documentElement.style.setProperty("--kv-sidebar_content_width", Math.max(pxWidth,0) + "px");
}

this.collapseSidebar = function() {
	document.body.classList.add("k-sidebar_hidden");
}

this.expandSidebar = function() {
	document.body.classList.remove("k-sidebar_hidden");
}

this.toggleSidebarExpansion = function() {
	document.body.classList.toggle("k-sidebar_hidden");
}
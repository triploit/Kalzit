this.nativeFileMime = function(extension){
	switch(extension){
		case "html": return "text/html";
		case "js": return "text/javascript";
		case "txt": return "text/plain";
		case "jpg": return "image/jpg";
		case "mp4": return "video/mp4";
		default: return "*"
	}
}
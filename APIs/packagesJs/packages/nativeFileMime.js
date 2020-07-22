/*
A rather function to determine the appropriate MIME type for a given file extension.
This function is optimized for speed, not convenience.
If you want to get MIME types in a more convenient way, use "fileMime" instead - it also accepts complete file names, for example.

This function only accepts the file extensions alone:
```
$mime = nativeFileMime: "txt". `Returns "text/plain"`
```
*/
this.nativeFileMime = function(extension){
	switch(extension){
		case "html": return "text/html";
		case "js": return "text/javascript";
		case "txt": return "text/plain";
		case "jpg": return "image/jpg";
		case "mp4": return "video/mp4";
		case "svg": return "image/svg+xml";
		case "json": return "application/json";
		default: return "*"
	}
}
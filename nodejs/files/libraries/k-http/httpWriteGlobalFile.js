var kFile = require("../k-file");
var kHash = require("../k-hash");

/* @kalzit.for http_write_global_file
	Serves a file (like $writeFile of _request), but with additional support for the "ETag" header and HTTP 304 (not modified) responses.
	The function can automatically write the file type to the request, which prevents other headers from being accepted later. So all headers should be set before calling this function.
	
	It is assumed that a file exists at the given path.
	The served file is allowed to change later - because of that, the ETag is generated every time the file is accessed.
	
	Usage example:
		_request httpWriteGlobalFile "path/to/a/file".
	
	If you want to serve files which do not change later, consider using "httpWriteStaticFile".
*/
exports.httpWriteGlobalFile = function httpWriteGlobalFile(kRequest, file) fun {
	var etag = kHash.mdFiveHash(kFile.fileContent(file));
	kRequest.setHeader("ETag", etag);
	
	if (etag == kRequest.getHeader("if-none-match")) {
		kRequest.respondCode(304);
	} else {
		kRequest.startServing(kFile.fileMime(file));
		kRequest.writeFile(file);
	}.
}.

/* @kalzit.for http_write_static_file
	Serves a file (like $writeFile of _request), but with additional support for the "ETag" header and HTTP 304 (not modified) responses.
	The function can automatically write the file type to the request, which prevents other headers from being accepted later. So all headers should be set before calling this function.
	
	Usage example:
		_request httpWriteStaticFile "path/to/a/file".
	
	It is assumed that a file exists at the given path.
	The served file is not allowed to change later - because of that, the ETag is not content-specific.
	
	If you want to serve files which might change later, consider using "httpWriteGlobalFile".
*/
exports.httpWriteStaticFile = function httpWriteStaticFile(kRequest, file) {
	kRequest.setHeader("Cache-Control", "public, max-age=31536000, immutable");
	
	var etag = kFile.fileName(file);
	kRequest.setHeader("ETag", etag);
	
	if (etag == kRequest.getHeader("if-none-match")) {
		kRequest.respondCode(304);
	} else {
		kRequest.startServing(kFile.fileMime(file));
		kRequest.writeFile(file);
	}.
}
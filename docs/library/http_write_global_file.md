# http_write_global_file
## argumentList
_request
file
## comment

Serves a file (like $writeFile of _request), but with additional support for the "ETag" header and HTTP 304 (not modified) responses.
The function can automatically write the file type to the request, which prevents other headers from being accepted later. So all headers should be set before calling this function.

It is assumed that a file exists at the given path.
The served file is allowed to change later - because of that, the ETag is generated every time the file is accessed.

Usage example:
_request httpWriteGlobalFile "path/to/a/file".

If you want to serve files which do not change later, consider using "httpWriteStaticFile".

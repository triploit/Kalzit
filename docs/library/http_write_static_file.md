# http_write_static_file
## argumentList
_request
file
## comment

Serves a file (like $writeFile propOf _request), but with additional support for the "ETag" header and HTTP 304 (not modified) responses.
The function can automatically write the file type to the request, which prevents other headers from being accepted later. So all headers should be set before calling this function.

Usage example:
_request httpWriteStaticFile "path/to/a/file".

It is assumed that a file exists at the given path.
The served file is not allowed to change later - because of that, the ETag is not content-specific.

If you want to serve files which might change later, consider using "httpWriteGlobalFile".

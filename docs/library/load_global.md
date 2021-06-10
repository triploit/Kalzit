# load_global
## comment


A function that is used to load data from any publicly available web server. It needs an absolute URL to do this (those relative to the current server will probably not work).

Usage example (Kalzit):
`$resolvedContent = loadGlobal: "https://www.example.com".`

Since the JavaScript code run in a browser is not allowed to talk to most servers directly, this function uses the endpoint "/api/loadUrl" of the Kalzit Server.

If you want to use relative URLs, consider using "loadLocal".
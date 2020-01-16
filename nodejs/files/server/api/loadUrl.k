print: "Trying to access external resource " + $url = "query" urlGetParameter $url of _request.
asyncRef = true.
{
	_request httpEndServingRaw strRaw: (default: ""): x
} loadGlobalAsync url.
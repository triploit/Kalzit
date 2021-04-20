print: "Trying to access external resource " + $url = "query" urlGetParameter $url of _request.
asyncRef = true.
{
	($startServing propOf _request): "text/plain".
	_request httpEndServingRaw strRaw: (default: ""): x
} loadGlobalAsync url.
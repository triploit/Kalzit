$command ? String = $command urlGetParameter ($url of _request).
!if ("localhost:" strStartsWith $host of _request) {
	print: "Running command on server side:" + command.
	asyncRef = true.
	{
		$result = x.
		!if (result eq void) {
			`fail`	
			($respondCode of _request): 404.
			($endServing of _request): "".
		}. !else {
			`success`
			($respondCode of _request): 200.
			($writeRaw of _request): result.
			($endServing of _request): "".
		}
	} runCommandAsyncRaw command.
}. !else {
	print: "Refused to run system command on server because of non-localhost URL: " + ($host of _request).
}.
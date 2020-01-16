$command ? String = $command urlGetParameter ($url of _request).
!if ("localhost:" strStartsWith $host of _request) {
	print: "Evaluating on server side:" + command.
	resultRef = strNewline strJoin (List:String): eval: command.
}. !else {
	print: "Refused to run command on server because of non-localhost URL: " + ($host of _request).
}.
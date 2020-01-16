$file ? String = $path urlGetParameter ($url of _request).
!if ("localhost:" strStartsWith $host of _request) {
	print: "Loading serverside file: " + file.
	!if (fileIsFile: file) {
		asyncRef = true.
		($startServing of _request): fileMime: file.
		($writeFile of _request): file.
	}.
}. !else {
	print: "Refused to load file on server because of non-localhost URL: " + ($host of _request).
}
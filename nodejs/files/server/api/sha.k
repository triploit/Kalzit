print: $app = $app urlGetParameter ($url of _request).

$shaFile = "./apps/" + app + ".shasum".
!if (fileIsFile: shaFile) {
	resultRef = fileContent: shaFile.
}.
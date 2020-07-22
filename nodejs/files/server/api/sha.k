print: $app = $app urlGetParameter ($url of _request).

$shaFile = "./apps/" + app + ".shasum".
!if (fileIsFile: shaFile) {
	resultRef = fileContent: shaFile.
}.
!else {
	resultRef = fileContent: (strFirstLine: fileContent: "./apps/" + app + ".redirect") + "/" + app + ".shasum"
}
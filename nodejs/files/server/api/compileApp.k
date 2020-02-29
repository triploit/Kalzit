print: "Trying to compile app " + $app = "app" urlGetParameter $url of _request.
!if (fileIsFile: $filePath = "./apps/" + app + ".k") {
	$compiled = calcitCompile: fileContent: "./apps/" + app + ".k".
	($startServing of _request): fileMime: "json".
	resultRef = compiled.
}.
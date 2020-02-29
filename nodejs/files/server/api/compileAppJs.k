print: "Trying to compile app as JS: " + $app = "app" urlGetParameter $url of _request.
!if (fileIsFile: $filePath = "./apps/" + app + ".k") {
	$compiled = calcitCompile: fileContent: "./apps/" + app + ".k".
	$compiledJs = 'GLang.evaluateTree(' + compiled + ', GLang.defaultRuntimeEnvironment)'.
	($startServing of _request): fileMime: "js".
	resultRef = compiledJs.
}.
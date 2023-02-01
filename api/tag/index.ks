`Go through all the files a user has, check if it has the given tag, and if yes, add it to a KMP collection`

!if sessionExists {
	asyncRef = true.
	
	$tag ? SafeFilePath = $tag urlGetParameter $url propOf _request.
	$file = userFolder + "/files/v2/categories/" + tag + "-kmp.json".
	fileCreateFolder: userFolder + "/files/v2/categories".
	
	!ifNot (fileIsFile: file) {
		`Get a list of files that are in the right category`
		$categoryMarkers = strNewline strSplit strTrim: print: runCommandFromArray:
			"find";
			"-L";
			(print: userFolder + "/files/v2/main");
			("-iname"; tag);
			("-type"; "f").
		
		$kmpObjects = {not: void eq x} filter !each categoryMarkers -> $categoryMarker fun {
			!if (fileIsFile: categoryMarker) {
				
				`Return the KMP object for the tagged file`
				(parseJson: fileContent: ($path = fileParent: fileParent: categoryMarker) + "/kmp.json");
				["title"; fileName: fileParent: fileRealpath: path];
				(!if (fileIsFile: print: $metadataFile =  path + "/metadata.json") {
					["k-metadata";[
						parseJson: fileContent: metadataFile
					]]
				})
				
			}
		}.
		print: objToJson: kmpObjects.
		
		`We now have the KMP object - write it to a file, so we can use it again later`
		!fileWrite (objToJson: ["title";"Tag: " + tag];kmpFromObjectCollection: kmpObjects) -> file.
		print: file.
	}.
	
	`Serve the KMP file`
	($startServing propOf _request): nativeFileMime: "json".
	($writeExistingFile propOf _request): file.
	do:($endServing propOf _request).
}.

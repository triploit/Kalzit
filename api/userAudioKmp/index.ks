$session ? Float = "session" urlGetParameter $url propOf _request.

$userTokenExists = false eq void eq $userToken = fileContent: "./nogit/users/sessions/" + session + ".txt".

!if userTokenExists {
	asyncRef = true.
	$file = "./nogit/users/data/v3/" + userToken + "/files/v2/categories/audio/kmp.json".

	!ifNot (fileIsFile: file) {
		file fileWrite objToJson: 
		(kmpFromObjectCollection:
			{not: void eq x} filter ($path fun {
				print: path.
				
				(parseJson: fileContent: path + "/kmp.json");
				!if (fileIsFile: path + "/thumbnail.png") {
					!if (fileIsFile: print: $metadataFile =  path + "/metadata.json") {
						["k-metadata";[
							parseJson: fileContent: metadataFile
						]]
					}
				}
			}) each folderContent: "./nogit/users/data/v3/" + userToken + "/files/v2/categories/audio");
			["title"; "My audio"];
			["keptArguments";[["session"]]].
	}.
			
	($startServing propOf _request): fileMime: file.
	($writeFile propOf _request): file.
	do:($endServing propOf _request).
	
}
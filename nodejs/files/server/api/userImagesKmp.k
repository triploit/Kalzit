$session ? Float = "session" urlGetParameter $url propOf _request.

$userTokenExists = false eq void eq $userToken = fileContent: "./nogit/users/sessions/" + session + ".txt".

!if userTokenExists {
	asyncRef = true.
	$file = "./nogit/users/data/v3/" + userToken + "/files/standard-images/kmp.json".
	"Cache-Control" ($setHeader propOf _request) "max-age=3600,private,immutable".

	!ifNot (fileIsFile: file) {
		file fileWrite objToJson: 
		(kmpFromObjectCollection:
			($path fun {
				(kmpFromImageFileUrl: "/api/uploaded?id=standard-images/raw/" + ($id = fileName: path));
				!if (fileIsFile: "./nogit/users/data/v3/" + userToken + "/files/standard-images/thumbnails/" + id + ".thumbnail.png") {
					["thumbnail";
						[
							["default"; "/api/thumbnail?id=standard-images/thumbnails/" + (fileName: path)]
						]
					];
					!if (fileIsFile: print: $metadataFile = "./nogit/users/data/v3/" + userToken + "/files/standard-images/metadata/" + id + ".json") {
						["k-metadata";[
							parseJson: fileContent: metadataFile
						]]
					}
				}
			}) each folderContent: "./nogit/users/data/v3/" + userToken + "/files/standard-images/raw");
			["title"; "My images"];
			["keptArguments";[["session"]]].
	}.
			
	($startServing propOf _request): fileMime: file.
	($writeFile propOf _request): file.
	do:($endServing propOf _request).
	
}
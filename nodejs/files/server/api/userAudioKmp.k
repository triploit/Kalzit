$session ? Float = "session" urlGetParameter $url propOf _request.

$userTokenExists = false eq void eq $userToken = fileContent: "./nogit/users/sessions/" + session + ".txt".

!if userTokenExists {
	asyncRef = true.
	$file = "./nogit/users/data/v3/" + userToken + "/files/audio-kmp.json".
	"Cache-Control" ($setHeader propOf _request) "max-age=3600,private".

	!ifNot (fileIsFile: file) {
		file fileWrite objToJson: 
		(
				`Standard audio`
				$standardAudioCollection = ($path fun {
					(kmpFromAudioFileUrl: "/api/uploaded?id=standard-audio/raw/" + ($id = fileName: path) + "&session=" + session);
					!if (fileIsFile: "./nogit/users/data/v3/" + userToken + "/files/standard-audio/thumbnails/" + id + ".thumbnail.png") {
						["thumbnail";
							[
								["default"; "/api/thumbnail?id=standard-audio/thumbnails/" + (fileName: path) + "&session=" + session]
							]
						];
						!if (fileIsFile: print: $metadataFile = "./nogit/users/data/v3/" + userToken + "/files/standard-audio/metadata/" + id + ".json") {
							["k-metadata";[
								parseJson: fileContent: metadataFile
							]]
						}
					}
				}) each folderContent: "./nogit/users/data/v3/" + userToken + "/files/standard-audio/raw".
				
				`Other audio`
				$otherAudioCollection = ($path fun {
					(kmpFromAudioFileUrl: "/api/uploaded?id=audio/raw/" + ($id = fileName: path) + "&session=" + session);
					!if (fileIsFile: "./nogit/users/data/v3/" + userToken + "/files/audio/thumbnails/" + id + ".thumbnail.png") {
						["thumbnail";
							[
								["default"; "/api/thumbnail?id=audio/thumbnails/" + (fileName: path) + "&session=" + session]
							]
						];
						!if (fileIsFile: print: $metadataFile = "./nogit/users/data/v3/" + userToken + "/files/audio/metadata/" + id + ".json") {
							["k-metadata";[
								parseJson: fileContent: metadataFile
							]]
						}
					}
				}) each folderContent: "./nogit/users/data/v3/" + userToken + "/files/audio/raw".
			
				kmpFromObjectCollection: standardAudioCollection;otherAudioCollection
			);
			["title"; "My audio"].
	}.
			
	($startServing propOf _request): fileMime: file.
	($writeFile propOf _request): file.
	do:($endServing propOf _request).
	
}
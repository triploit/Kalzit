$session ? Float = "session" urlGetParameter $url propOf _request.

$userTokenExists = false eq void eq $userToken = fileContent: "./nogit/users/sessions/" + session + ".txt".

!if userTokenExists {
	asyncRef = true.
	$file = "./nogit/users/data/v3/" + userToken + "/files/standard-videos/kmp.json".
	"Cache-Control" ($setHeader propOf _request) "max-age=3600,private,immutable".

	!ifNot (fileIsFile: file) {
		file fileWrite objToJson: 
		(kmpFromObjectCollection:
			($path fun {
				(kmpFromVideoFileUrl: "/api/uploaded?id=standard-videos/raw/" + ($id = fileName: path) + "&session=" + session);
				!if (fileIsFile: "./nogit/users/data/v3/" + userToken + "/files/standard-videos/thumbnails/" + id + ".thumbnail.png") {
					["thumbnail";
						[
							["default"; "/api/thumbnail?id=standard-videos/thumbnails/" + (fileName: path) + "&session=" + session]
						]
					]	
				}
			}) each folderContent: "./nogit/users/data/v3/" + userToken + "/files/standard-videos/raw");
			["title"; "My videos"].
	}.
			
	($startServing propOf _request): fileMime: file.
	($writeFile propOf _request): file.
	do:($endServing propOf _request).
	
}
`This script changes the kmp.json file of a given file and sets the entry thumbnail.default to a new value`
$fileToChange = appParameter: "file-to-change".
$newThumbnail = appParameter: "new-thumbnail".

$kmpFile = print: fileToChange + "/kmp.json".
$jsonObject = parseJson: fileContent: kmpFile.

`Modify the JSON object`
$oldThumbnailInfo = $thumbnail propOf jsonObject.

$newJsonObject = 
	[$thumbnail;
		[
			[$default; newThumbnail];
			oldThumbnailInfo
		]
	];
	jsonObject.
	
print: objToJson: newJsonObject.
!fileWrite objToJson: newJsonObject -> kmpFile.
$language = second: "([a-z]{2}(\-[a-zA-Z]{2})?)" match $l urlGetParameter $url of _request.
print: "Serving strings file for language " + language.

$simpleLanguage = second: "([a-z]{2})\-[a-zA-Z]{2}" match language.

asyncRef = true.
($startServing of _request): fileMime: "json".
!ifNot (void eq language) {
	$filePath = "./assets/strings/" + language + "/default.json".
	!if (fileIsFile: filePath) {
		($writeFile of _request): filePath
	}.
	!else {
		$simpleFilePath = "./assets/strings/" + simpleLanguage + "/default.json".
		!if (fileIsFile: simpleFilePath) {
			($writeFile of _request): simpleFilePath
		}.
		!else {
			($writeFile of _request): "./assets/strings/default.json".
		}
	}
}.
do:($endServing of _request).
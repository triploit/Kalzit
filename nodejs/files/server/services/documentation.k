$toDocument = "./services/documentation/" strRemove fname.
print: "Serving documentation for " + toDocument.

$unified = calcitUnifyName: toDocument.
!if (fileIsFile: "./docs/jsLibrary/" + unified + ".md") {
	`Use the external documentation`
	asyncRef = true.
	"Location" ($setHeader propOf _request) "/docs/jsLibrary/" + unified + ".md".
	($respondCode propOf _request): 301.
	!($endServing propOf _request).
}. !else {
	`Get the documentation from a "normal" Kalzit value`
	$value = resolveName: toDocument.
	($startServing of _request): fileMime: "html".
	resultRef = strNewline strJoin ("<title>" + (calcitUnifyName toDocument) + " - Kalzit Docs</title>");{
		<link rel="stylesheet" href="/assets/stylesheets/html5/article.css"/>
		<link rel="stylesheet" href="/assets/stylesheets/html5/default/style.css"/>
	}; (default: "Oh no, no documentation was found for " + toDocument): {
		"<p><h2>" + (first: x) + "</h2>" + ((strNewline;"<br>") strReplace second: x) + "</p>"
	} each {
		`Do not show the UI generator function in the documentation`
		not: "uiGenerator" eq first: x
	} filter calcitAnnotations: value.
}
$toDocument = "./services/documentation/" strRemove fname.
print: "Serving documentation for " + toDocument.

$value = resolveName: toDocument.
($startServing of _request): fileMime: "html".
resultRef = strNewline strJoin {
	<link rel="stylesheet" href="/assets/stylesheets/html5/article.css"/>
	<link rel="stylesheet" href="/assets/stylesheets/html5/default/style.css"/>
}; (default: "Oh no, no documentation was found for " + toDocument): {
	"<p><h2>" + (first: x) + "</h2>" + ((strNewline;"<br>") strReplace second: x) + "</p>"
} each calcitAnnotations: value.
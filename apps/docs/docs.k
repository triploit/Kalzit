uiTitle: "Library overview - Kalzit Docs".

$originalList = $searchResults = {not: "_" strStartsWith x} filter !pmListNames.
$searchResultsRef = reference: $searchResults.

print: @(percentWidth 100) ($search fun {
	searchResultsRef = {(calcitUnifyName: search) strContains x} filter originalList
}) uiTextfieldOnchange "".

print: uiShowFunctionAsList: {
	{("/api/documentation?name=" + x) uiLink x} each searchResults
}
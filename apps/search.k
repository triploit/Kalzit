$searchTerm = appParameter: $query.

$duckResultView = !fun ($_result) {
    $url = $url of _result.
    $pathArray = "/" strSplit url.
	$protocol = first: pathArray.
	$host = third: pathArray.
	$icon = protocol + '//' + host + "/favicon.ico".
    
	@("resultLink";url) uiContainer: (@(pxWidth 20) uiShowImageUrl: icon);(uiHorizontalPercentSpace 1);(@(percentWidth 82) uiContainer: url);$snippet of _result
}.

$youtubeResultView = !fun ($id) {
	$url = "https://youtu.be/" + id.
	$icon = "https://www.youtube.com/favicon.ico".
	@("resultLink";url) uiContainer: (@(pxWidth 20) uiShowImageUrl: icon);(uiHorizontalPercentSpace 1);(@(percentWidth 82) uiContainer: url)
}.

$colorChange ? Boolean = false. $colorChangeRef = reference: $colorChange.

!if (searchTerm eq void) {
	@(percentWidth 80) @(percentHeight 10) @center @(pxRoundness 10) @(emFontSize 3) @(backgroundColor: 200;200;255;255)
	$textField = {popupUrl: "/?app=search.txt&query=" + urlEncodeParameter: x} uiTextfieldOnaction "".
	
	print: textField.
}. else {
	print: uiContainer: {
		$link = @(foregroundColor: black) ($resultLink of calcitAnnotations: x) uiLink $view = x.
		!if colorChange {
			@(backgroundColor: 200;200;255;255) view
		}.
		colorChangeRef = not: colorChange.
		
		link
	} each
		(duckResultView each duckSearchResults: searchTerm);youtubeResultView each youtubeSearchVideoIds: searchTerm.
}.

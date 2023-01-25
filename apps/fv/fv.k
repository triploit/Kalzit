`This is a basic app to view files by URL - used for sending files with QR codes`

$file = $f urlGetParameter !dynamicAppUrl.

$session = (default: storageLoadString: $calcitSession):
	$session urlGetParameter !dynamicAppUrl.
	
$display = $d urlGetParameter !dynamicAppUrl.

$fileUrl = "/api/uploaded?id=" + (urlEncodeParameter: file) + "&session=" + session.

toolAtLeft:
	!buttonTool "Download" -> {downloadUrl: fileUrl}.
print: !uiGlobalToolbar.

`Two cases - either the user is logged in, or not`
!ifElse (session eq void) {
	`User is not logged in`
	print: !uiLoginHint
};{
	`User is logged in`
	`Produce the main file content view`
	$url = "/api/uploaded?id=" + (urlEncodeParameter: file) + "&session=" + session.
	print: @(percentWidth 100) @belowToolbar
		do: first: (display) switch
			[{"a" eq x};{uiAudioPlayer: url}];
			[{"v" eq x};{uiVideoPlayer: url}];
			[{"i" eq x};{@fit uiShowImageUrl: url}];
			[true;{uiShowWebpageUrl: url}].
}
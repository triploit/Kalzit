$requestedDownload = $url urlGetParameter $url propOf _request.
$resultingFileName = "./generated/vdl_" + (("%";"_prct_") strReplace urlEncodeParameter: requestedDownload) + ".m4a".
$markerFile = resultingFileName + ".dlmarker.txt".

!ifNot ((fileIsFile: resultingFileName) | fileIsFile: markerFile) {
	`The download is not done already`
	$command = 'youtube-dl -o "' + resultingFileName + '" -f "bestaudio[ext=m4a]" "' + requestedDownload + '"'.

	markerFile fileWrite requestedDownload.
	`Run command`
	{
		print: "YoutubeDl command is done! For " + requestedDownload.
		fileDelete: markerFile.
	} runCommandAsyncRaw command.
}.

resultRef = "Started download of " + requestedDownload.
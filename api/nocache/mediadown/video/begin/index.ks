$requestedDownload = $url urlGetParameter $url propOf _request.
$resultingFileName = "./generated/vdl_" + (("%";"_prct_") strReplace urlEncodeParameter: requestedDownload) + ".mp4".
$markerFile = resultingFileName + ".dlmarker.txt".

!ifNot ((fileIsFile: resultingFileName) | fileIsFile: markerFile) {
	`The download is not done already; trigger the download, prevent av0 codec because it is not supported by some players (iOS, for example)`
	$command = 'youtube-dl -o "' + resultingFileName + '"  -f "bestvideo[ext=mp4][vcodec!^=av0]+bestaudio[ext=m4a]/mp4" --merge-output-format mp4 "' + requestedDownload + '"'.

	markerFile fileWrite requestedDownload.
	`Run command`
	{
		print: "YoutubeDl command is done! For " + requestedDownload.
		fileDelete: markerFile.
	} runCommandAsyncRaw command.
}.

resultRef = "Started download of " + requestedDownload.
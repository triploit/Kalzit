$id ? YoutubeVideoId = $id urlGetParameter ($url of _request).
asyncRef = true.

$sendStuff = $kmpObject fun {
	"Cache-Control" ($setHeader propOf _request) "public, max-age=31536000, immutable".
	($startServing of _request): fileMime: "json".
	($write propOf _request): objToJson: kmpObject.
}.

!ifElse (isDefined: $kalzitMediaProtocolFromYoutubeVideoAsync) {
	`Do it asynchronously if possible`
	sendStuff kalzitMediaProtocolFromYoutubeVideoAsync id.
};{
	sendStuff: kalzitMediaProtocolFromYoutubeVideo: id.
}
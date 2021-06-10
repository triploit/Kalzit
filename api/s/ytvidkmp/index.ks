$id ? YoutubeVideoId = $id urlGetParameter ($url of _request).
asyncRef = true.

{
	"Cache-Control" ($setHeader propOf _request) "public, max-age=31536000, immutable".
	($startServing of _request): fileMime: "json".
	($write propOf _request): objToJson: x.
} kalzitMediaProtocolFromYoutubeVideo: id.
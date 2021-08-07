asyncRef = true.

!kmpFromSubredditAsync ($name urlGetParameter $url of _request) -> {
	($startServing propOf _request): fileMime: "json".
	($write propOf _request): objToJson: x.
	do: ($endServing propOf _request).
}
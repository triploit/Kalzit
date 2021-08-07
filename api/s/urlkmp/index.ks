($startServing of _request): fileMime: "json".

$u = $url urlGetParameter $url of _request.

$serveStuff = $kmp fun {
	($startServing propOf _request): fileMime: "json".
	($write propOf _request): objToJson: kmp.
	do:($endServing propOf _request).
}.

$action = u switchFirst
	[{"youtube\.com" isMatch u};{
		!kalzitMediaProtocolFromYoutubeUrlAsync (Url: u) -> serveStuff
	}];
	[{"reddit\.com/r/([a-zA-Z0-9_]+)/?" isMatch u};{
		$subreddit = second: "reddit\.com/r/([a-zA-Z0-9_]+)/?" match u.
		!kmpFromSubredditAsync (subreddit) -> serveStuff
	}];
	[{"instagram\.com/([a-zA-Z0-9_\-\.]+)" isMatch u};{
		!kmpFromInstagramUserAsync (print: second: "instagram\.com/([a-zA-Z0-9_\-\.]+)" match u) -> serveStuff
	}].
	
!ifNot (void eq action) {asyncRef = true. do: action}.
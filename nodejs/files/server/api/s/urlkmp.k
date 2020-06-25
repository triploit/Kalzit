($startServing of _request): fileMime: "json".

$u = $url urlGetParameter $url of _request.

resultRef = do: first: u switch
	[{"youtube\.com" isMatch u};{kalzitMediaProtocolFromYoutubeUrl: Url: u}];
	[{"reddit\.com/r/([a-zA-Z0-9_]+)/?" isMatch u};{objToJson: kmpFromSubreddit: second: "reddit\.com/r/([a-zA-Z0-9_]+)/?" match u}];
	[{"instagram\.com/([a-zA-Z0-9_\-\.]+)" isMatch u};{objToJson: kmpFromInstagramUser: second: "instagram\.com/([a-zA-Z0-9_\-\.]+)" match u}].
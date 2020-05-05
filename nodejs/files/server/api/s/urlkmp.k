($startServing of _request): fileMime: "json".

$u = $url urlGetParameter $url of _request.

print u.
resultRef = do: first: u switch
	[{"youtube\.com" matches u};{kalzitMediaProtocolFromYoutubeUrl: Url: u}];
	[{"reddit\.com/r/([a-zA-Z0-9_]+)/?" matches u};{objToJson: kmpFromSubreddit: print: second: "reddit\.com/r/([a-zA-Z0-9_]+)/?" match u}];
	[{"instagram\.com/([a-zA-Z0-9_\-\.]+)" matches u};{objToJson: kmpFromInstagramUser: print: second: "instagram\.com/([a-zA-Z0-9_\-\.]+)" match u}].
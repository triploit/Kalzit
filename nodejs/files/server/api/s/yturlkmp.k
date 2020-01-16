$ids = youtubeVideoIdsByUrl: $u = $url urlGetParameter ($url of _request).
($startServing of _request): fileMime: "json".
resultRef = "{" + {"title":"} + (urlTitle: u) + {","kind":"collection","protocolVersion":"1.0.0","collection":[} + ("," strJoin objToJson each ("http://" + ($host of _request) + "/api/s/ytvidkmp?id=") + ids) + {]} + "}".
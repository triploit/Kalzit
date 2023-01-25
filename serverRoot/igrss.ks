asyncRef = true.
!instagramUserRssContentStringAsync print: $user urlGetParameter $url propOf _request -> {
	print: x.
	($endServing propOf _request): x
}.
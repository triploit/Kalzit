# kmp_from_youtube_url_no_titles
## argumentList
url_cached
## comment

Produces a KMP (Kalzit Media Protocol) representation by any YouTube URL.
This does not include the title information.
The media type (field "kind") is "collection", and the items are of type "video".

Usage example:
```kalzit
$startPageVideos = kmpFromYoutubeUrlNoTitles: "https://www.youtube.com".
```

If you do not want to access the titles, use "kmpFromYoutubeUrl".

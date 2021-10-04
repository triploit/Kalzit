# kmp_from_youtube_url_async
## argumentList
callback
url
## comment

Produces a KMP (Kalzit Media Protocol) representation by any YouTube URL.
This includes the title information of the videos, which is parsed from the YouTube watch page.
The media type (field "kind") is "collection", and the items are of type "video".

Usage example:
```kalzit
!kmpFromYoutubeUrlAsync "https://www.youtube.com" -> {$startPageVideos = x}.
```

If you do not want to access the watch page or if you do not need the title, use "kmpFromYoutubeVideoNoTitles".

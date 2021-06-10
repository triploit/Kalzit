# kmp_from_youtube_video_no_titles
## argumentList
id
## comment

Produces a KMP (Kalzit Media Protocol) representation of a YouTube Video, represented by a video ID.
This does not include the title information.
The media type (field "kind") is "video".

Usage example:
```kalzit
$kmpData = kmpFromYoutubeVideoNoTitles: "videoId".
```

If you do not want to access the titles, use "kmpFromYoutubeVideo".

# kalzit_media_protocol_from_youtube_video
## argumentList
id
## comment

Produces a KMP (Kalzit Media Protocol) representation of a YouTube Video, represented by a video ID.
This includes the title information, which is parsed from the YouTube watch page.
The media type (field "kind") is "video".

Usage example:
```kalzit
$kmpData = kmpFromYoutubeVideo: "videoId".
```

If you do not want to access the watch page or if you do not need the title, use "kmpFromYoutubeVideoNoTitles".

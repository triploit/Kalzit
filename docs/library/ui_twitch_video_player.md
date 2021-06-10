# ui_twitch_video_player
## comment

Produces a UI element that displays specified Twitch video.
The element is produced by the Twitch JavaScript API, which is automatically loaded when you use a uiTwitchPlayer function.

As with uiAudioPlayer and uiVideoPlayer, you can specify a callback to receive a media controller.

Usage example:
```
`The simplest way`
print: uiTwitchVideoPlayer: "videoId".

`With a media controller`
print: "videoId" uiTwitchVideoPlayer {play: x}.
```
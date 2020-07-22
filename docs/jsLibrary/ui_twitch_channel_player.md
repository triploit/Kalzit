## comment

Produces a UI element that displays the current stream of a Twitch channel.
The element is produced by the Twitch JavaScript API, which is automatically loaded when you use a uiTwitchPlayer function.

As with uiAudioPlayer and uiVideoPlayer, you can specify a callback to receive a media controller.

Usage example:
```
`The simplest way`
print: uiTwitchChannelPlayer: "channelName".

`With a media controller`
print: "channelName" uiTwitchChannelPlayer {play: x}.
```
# ui_twitch_collection_player
## comment

Produces a UI element that displays the specified Twitch video collection.
The element is produced by the Twitch JavaScript API, which is automatically loaded when you use a uiTwitchPlayer function.

As with uiAudioPlayer and uiVideoPlayer, you can specify a callback to receive a media controller.

Usage example:
```
`The simplest way`
print: uiTwitchCollectionPlayer: "collectionId".

`With a media controller`
print: "collectionId" uiTwitchCollectionPlayer {play: x}.
```
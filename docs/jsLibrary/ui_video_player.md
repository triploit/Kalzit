## comment

Creates a media controller and a graphical representation of the video (usually shows a frame of the video, control buttons and a progress indicator) from any URL that points to a video file.
The function expects two parameters: The URL and a callback, which will be called when the media controller is ready.

Usage example:
```kalzit
"anyVideoFileUrl" uiVideoPlayer ($_mediaController fun {
`We can start playing now`
play: _mediaController
}).
```

For more information about media controllers, take a look at the "MediaController" type.
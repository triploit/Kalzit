# media_controller
## argumentList
_mediaController
## comment

This function only exists to document media controllers and does not have any effect.

A media controller is an object with a standardised set of named properties, which make it compatible with many functions.
These properties are:


getProgress: A function which returns how far this piece of media has progressed in seconds.
setTime: A function which takes a time (in seconds) and jumps to that position.
setOnEnd: A function which takes a listener function that will be run when the medium reaches its end.
setOnProgress: A function which takes a listener function that will be run whenever the value of getProgress changes - the listener should never perform a very long operation.
play: A function that causes the medium to start playing - if the end was already reached before, it starts from the beginning, otherwise it resumes from where it was before.
pause: A function that causes the medium to stop playing - the current progress / time is kept.
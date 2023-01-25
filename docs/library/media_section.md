# media_section
## argumentList
_mediaController
_startAndEnd
## comment

Creates a media controller that acts on a section of a different one.
Requires the media controller as the first parameter, and the start and end timestamps as the second (as a list with two numbers).

For example, if the media controller "originalController" exists, and you want to cut of two seconds at the start and ten at the end, you could do this:
$startTime = 2.
$endTime = (do: $getDuration propOf originalController) - 10.
$newController = originalController mediaSection startTime;endTime.

Now, if you would use "newController" with the "replay" function, the original medium would start playing, but at 2 seconds in.
Also, it would then stop playing 10 seconds before its original end.

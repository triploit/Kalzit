# decrease_volume
## argumentList
_volumeController
## comment

Decreases the current volume of an audio controller (any medium with sound). This is done by calling its $getVolume and $setVolume properties.
The medium needs to be specified as the first parameter.

How much the volume should be decreased is defined by "volumeStepSize".
If the resulting new volume is lower than one (0), which would be to quiet, it is set to 1.

# increase_volume
## argumentList
_volumeController
## comment

Increases the current volume of an audio controller (any medium with sound). This is done by calling its $getVolume and $setVolume properties.
The medium needs to be specified as the first parameter.

How much the volume should be increased is defined by "volumeStepSize".
If the resulting new volume is larger than one (1), which would be to loud, it is set to 1.

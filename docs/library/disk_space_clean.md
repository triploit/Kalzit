# disk_space_clean
## argumentList
freeTargetInMegabytes
callback
## comment

Attempts to clean disk space so that a specified target is available afterwards. This might not work in all cases.
The callback is called when the cleaning is finished - its parameter is true if the required space is now available, or false if it is not.

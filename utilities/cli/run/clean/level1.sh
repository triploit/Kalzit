# Cleaning level 1 is supposed to remove files that were created while building things or installing Kalzit
# This includes minified JS library files that have been added into the apps, or the downloads of ffmpeg and ffprobe
# The script should not remove files that are helpful with debugging stuff
# It is supposed to be very quick, so no time-consuming commands should be used
# After running this script, you should always be able to run "./cli build everything" or "bash utilities/installer/runLocallyWithoutNodejs.sh" and restore the deleted files that way

echo Running clean/level1 ...

echo Removing ffmpeg.zip and ffprobe.zip ...
rm -f ./generated/ffmpeg.zip
rm -f ./generated/ffprobe.zip

echo Removing minified library files ...
find ./APIs -name '_min.js' -exec rm {} \;

echo 'Removing appBuildingTempFile(s).js and scriptTagListingTempFile.js ...'
# rm -f ./generated/translationMap.json
rm -f ./generated/appBuildingTempFile-*.js
rm -f ./generated/scriptTagListingTempFile.js

echo clean/level 1 is done!
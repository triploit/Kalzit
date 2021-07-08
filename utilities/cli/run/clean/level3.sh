# Cleaning level 3 is supposed to remove user files that are very likely to never be used again.
# These files have to be able to be re-generated. You must never delete a raw file here, for instance.

echo Running clean/level3 ...

# echo Removing file thumbnails ...
# find ./nogit/users/data/v3 -name 'thumbnail.png' -type f -exec rm {} \;

echo clean/level3 is done!
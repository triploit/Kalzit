# Cleaning level 2 is supposed to remove files that were created as cache for internet-based APIs.
# Most of these should be located in the ./nogit/cache folder
# Running this might make some internet-based APIs a little bit slower, since the caches are removed.
# However, all caches removed by this script should not slow down the APIs too much - you should not remove the "listing.json" files inside the user data folder, for example, as they take a long time to build again.

# echo Running clean/level2 ...
# 
# echo Removing the unused ./nogit/cache/maptiles folder ...
# rm -rf ./nogit/cache/maptiles
# 
# echo Removing cached YouTube titles ...
# rm -f ./nogit/cache/yttitles/*.txt
# 
# echo clean/level2 is done!
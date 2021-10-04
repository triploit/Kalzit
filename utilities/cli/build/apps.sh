#Before doing anything else, build the home screen data
./cli build homescreenData

rootFolder="$(pwd)"
appSkeleton="$rootFolder/_browser_app_singlefile.html"
appFolder="$rootFolder/apps"
arguments="$@"

#Look for build.sh files in /apps/*
for idFile in $(find -L "$appFolder" -type f -name "appId.txt")
do
	id="$(cat $idFile)"
	./cli build app "$id"
done

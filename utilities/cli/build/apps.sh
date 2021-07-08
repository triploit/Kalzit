#Before doing anything else, build the home screen data
./cli build homescreenData

rootFolder="$(pwd)"
appSkeleton="$(pwd)/_browser_app_singlefile.html"
cd ./apps
appFolder="$(pwd)"
arguments=$@

#Look for build.sh files in /apps/*
for buildFile in $(find -L "$appFolder" -type f -name "build.sh")
do
	cd "$rootFolder"
	echo "Running app build script '$buildFile'"
	./cli run upgradeBuildFile "$buildFile"
	cd "$(dirname "$buildFile")"
	bash ./build.sh $arguments
done

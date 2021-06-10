#Before doing anything else, build the home screen data
./cli build homescreenData

rootFolder="$(pwd)"
appSkeleton="$(pwd)/_browser_app_singlefile.html"
cd ./apps
appFolder="$(pwd)"
arguments=$@

build_all_k_files_in_folder () {
	cd "$1"
	for file in *.k
	do
		#Skip *.k (means that no matching file was found)
		[ "*.k" == "$file" ] && continue
		
		bash "$rootFolder/utilities/cli/build/kalzitFile.sh" "$1/$file" "$rootFolder" $arguments
	done
}

#Look for build.sh files in /apps/*
for buildFile in $(find -L "$appFolder" -type f -name "build.sh")
do
	echo "Running app build script '$buildFile'"
	cd "$(dirname "$buildFile")"
	bash ./build.sh
done

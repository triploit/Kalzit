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

#Look for .redirect files in /apps
for redirect in $(find "$appFolder" -type f -name "*.redirect" -or -type d)
do
	if [ -f "$redirect" ]; then
		redirectedFile=$(cat "$redirect")
	else
		redirectedFile="$redirect"
	fi
	if [ -e "$redirectedFile" ]; then
		#Check if a custom build script exists
		if [ -e "$redirectedFile/build.sh" ]; then
			echo "Running custom build script for app '$redirectedFile/build.sh'"
			cd "$redirectedFile"
			bash ./build.sh
		else
			build_all_k_files_in_folder "$redirectedFile"
		fi
	fi
done

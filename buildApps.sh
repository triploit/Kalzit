rootFolder="$(pwd)"
appSkeleton="$(pwd)/_browser_app_singlefile.html"
cd ./apps
appFolder="$(pwd)"
arguments=$@

build_all_k_files_in_folder () {
	for file in $(find "$1" -type f -name "*.k")
	do
		bash "$rootFolder/buildKalzitFile.sh" "$file" "$rootFolder" $arguments
	done
}

build_all_k_files_in_folder "$appFolder"

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

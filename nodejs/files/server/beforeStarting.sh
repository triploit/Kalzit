echo Changing old .redirect files into symlinks ...
bash ./getRidOfRedirects.sh

./cli run clean/onStartup

echo Removing calcitSession and keys.json files...
rm ./nogit/users/data/v3/*/keys/calcitSession
rm ./nogit/users/data/v3/*/deletedKeys/calcitSession
rm ./nogit/users/data/v3/*/keys.json

echo Removing remaining sessions... TODO: do that on logout
rm -rf ./nogit/users/data/v3/*/sessions
rm -rf ./nogit/users/sessions

echo Removing audio-kmp.json...
rm ./nogit/users/data/v3/*/files/audio-kmp.json

echo Migrating potential old access files to v2...
migrateFolder(){
	#Warning: Do never use global variables here - leads to a wrong folder structure in the end result
	local userFolder="$1"
	local folder="$2"
	local accessName="$3"
	echo Beginning migration of access folder "$accessName"

	#Loop through the files in the folder - if a folder was found, do that recursively
	for file in "$folder"/*; do
	    if [ -d "${file}" ]; then
	        migrateFolder "$userFolder" "$file" "$accessName/$(basename -- $file)"
	    else
	    	if [ -f "$file" ]; then
		    	#We found a file! Migrate it
		    	baseName="$(basename -- "$file")"
		    	newFolderName="$userFolder/files/versionedAccess/v2$accessName/$(basename -- "$file")"
		    	mkdir -p "$newFolderName"
		    	
		    	versionName="$(date +%s)"
		    	echo mv "$file" "$newFolderName/$versionName"
		    	mv "$file" "$newFolderName/$versionName"
		    	echo "Creating initial version marker..."
		    	echo "$versionName" > "$newFolderName/currentVersion.txt"
	    	fi
	    fi
	done
}

#Loop through all user folders
for userFolder in ./nogit/users/data/v3/*
do
	echo Migrating access files of user $userFolder to v2...
	#Loop through all files in the "access" folder
	migrateFolder "$userFolder" "$userFolder/files/access" ""
done
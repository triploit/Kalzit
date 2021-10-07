rootFolder="$(pwd)"
cd ./apps
appFolder="$(pwd)"
arguments=$@

needsComma=0
add_to_homescreen () {
	homescreenConfigPath="$1/config/home.json"
	if [ -f "$homescreenConfigPath" ]; then
		if [ "1" == "$needsComma" ]; then
			echo "," >> "$rootFolder/apps/home/config/standardApps.json"
		fi
		cat "$homescreenConfigPath" >> "$rootFolder/apps/home/config/standardApps.json"
		needsComma=1
	fi
}

#Begin writing to the "standardApps.json" file (make sure the parent folder exists first)
mkdir "$rootFolder/apps/home/config"
echo "[" > "$rootFolder/apps/home/config/standardApps.json"

#Look for folders in /apps
for folder in $(find -L "$appFolder" -type d)
do
	add_to_homescreen "$folder"
done

echo "]" >> "$rootFolder/apps/home/config/standardApps.json"
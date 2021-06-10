appFolder="$1"
appName="$(basename $appFolder)"

#Create the app folder structure
mkdir "$appFolder/$appName.app"
mkdir "$appFolder/$appName.app/Contents"
mkdir "$appFolder/$appName.app/Contents/MacOS"

#Add a .gitignore file to make the other generated files (below) less annoying
echo "*" > "$appFolder/$appName.app/.gitignore"

#Copy the app opener script into the Contents folder
cp "./utilities/cli/run/macWebApp.sh" "$appFolder/$appName.app/Contents/macWebApp.sh"

#Copy the index file into the Contents folder
cp "$appFolder/index.html" "$appFolder/$appName.app/Contents/index.html"

#Write the executable (will open localhost:5000 in a browser)
executablePath="$appFolder/$appName.app/Contents/MacOS/$appName"
echo "#!/bin/bash" > "$executablePath"
echo 'bash $(dirname $0)/../macWebApp.sh file://$(dirname $0)/../index.html' >> "$executablePath"

#Make the executable file actually executable
chmod +x "$executablePath"

#Attempt to set an app icon
if [ -f "$appFolder/icons/iOS.png" ]; then
	./cli build macAppIcon "$appFolder/icons/iOS.png" "$appFolder/doNotTouch/macOS_icon.png"
	./cli set macFileIcon "$appFolder/doNotTouch/macOS_icon.png" "$appFolder/$appName.app"
fi
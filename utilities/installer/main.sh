#TODO: Check for unzip (and zip) commands first.
#If they do not exist, try to use Git for downloading or install the commands

#Download the release from GitHub
TAG=$(curl -s https://api.github.com/repos/triploit/Kalzit/releases/latest \
| grep "tag_name" \
| awk '{print substr($2, 2, length($2)-3)}')
LOCATION="https://github.com/triploit/Kalzit/archive/$TAG.zip"

curl -L -o ./latestRelease.zip "$LOCATION"

#Unzip the downloaded repository
unzip ./latestRelease.zip -d .

#Give the unzipped folder a more predictable name (ask before overwriting anything)
projectFolder="$(pwd)/Kalzit"
mv -i "$(pwd)/Kalzit-$TAG" "$(pwd)/Kalzit"

#Create a starter executable
mainExecutable="./KalzitStarter"

echo "#!/bin/sh" > $mainExecutable
echo "cd \"$projectFolder\"" >> $mainExecutable
echo "./cli start blockingServer" >> $mainExecutable
chmod +x $mainExecutable

#Remove downloaded .zip file
rm ./latestRelease.zip

#Run the installer.sh file
cd "$projectFolder"
bash ./utilities/installer/runLocallyWithoutNodejs.sh
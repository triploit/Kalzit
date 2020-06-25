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

#Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
#Make NVM usable right now
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

#Install NodeJS
nvm install node

#Run the installer.sh file
cd "$projectFolder"
bash ./utilities/installer/runWithNodejs.sh
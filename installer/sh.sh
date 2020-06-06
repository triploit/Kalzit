#Download the release from GitHub
TAG=$(curl -s https://api.github.com/repos/triploit/Kalzit/releases/latest \
| grep "tag_name" \
| awk '{print substr($2, 2, length($2)-3)}')
LOCATION="https://github.com/triploit/Kalzit/archive/$TAG.zip"

curl -L -o ./latestRelease.zip "$LOCATION"

#Unzip the downloaded repository
unzip ./latestRelease.zip -d .
projectFolder="$(pwd)/Kalzit-$TAG"

#Create a starter executable
mainExecutable="./KalzitStarter"

echo "#!/bin/sh" > $mainExecutable
echo "cd \"$projectFolder/nodejs/files\"" >> $mainExecutable
echo bash run.sh >> $mainExecutable
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
bash ./install.sh
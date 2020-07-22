#We seemingly have to do the NodeJS stuff here and not somewhere else
#Otherwise the command is not found

#Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
#Make NVM usable right now
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

#Install NodeJS
nvm install node


#Stuff that uses 'node'
bash ./utilities/installer/runWithNodejs.sh

echo
echo The Kalzit installation should be done now.
echo If you did not have NodeJS installed before,
echo please open a new terminal window to make sure all commands are working.
echo Have fun!
echo
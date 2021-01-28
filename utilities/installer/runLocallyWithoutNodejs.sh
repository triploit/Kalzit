#TODO: check for the nodejs command
if ! command -v node &> /dev/null
then
    echo "Node.js needs to be installed. You can download it here:"
    echo
    echo "https://nodejs.org/en/download/"
    echo
    echo "Please run this script again after installing Node.js"
    exit
fi

#Stuff that uses 'node' and 'npm'
bash ./utilities/installer/runWithNodejs.sh $@

echo
echo The Kalzit installation should be done now.
echo If you did not have NodeJS installed before,
echo please open a new terminal window to make sure all commands are working.
echo Have fun!
echo
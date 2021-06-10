#TODO: check for the nodejs and ffmpeg commands
manualInstallNeeded=0

if ! command -v node &> /dev/null
then
    echo
    echo
    echo "Please download Node.js and install it: https://nodejs.org/en/download/"
    echo
    exit
fi


mkdir ./generated

#Check for / install ffmpeg
if ! command -v ffmpeg &> /dev/null
then
    echo "Attempting to download ffmpeg (utility for app- and file-icon generation)..."
    #Idea for system check from https://stackoverflow.com/questions/3466166/how-to-check-if-running-in-cygwin-mac-or-linux
    unameOut="$(uname -s)"
	case "${unameOut}" in
	    Linux*)     machine=Linux;;
	    Darwin*)    machine=Mac;;
	    *)          machine="UNKNOWN:${unameOut}"
	esac
	
	if [[ "${machine}" == "Mac" ]]
	then
		#Mac version
		mkdir ./generated
		curl -L https://evermeet.cx/ffmpeg/getrelease/zip > "./generated/ffmpeg.zip"
	    unzip ./generated/ffmpeg.zip -d ./generated
	    chmod +x ./generated/ffmpeg
	    
		echo "Trying to make ffmpeg available globally..."
	    echo "Please authenticate:"
	    sudo mv ./generated/ffmpeg /usr/local/bin/ffmpeg
	else
		#Linux version - no automatic download available yet
        echo
        echo "You seem to be installing Kalzit on a Linux system."
        echo "We can not automatically install ffmpeg on Linux yet, so you should do that manually."
        echo
        echo "Please download Ffmpeg and install it: https://ffmpeg.org/download.html"
        echo "After that, run this script again to continue the installation"
        echo
        exit
	fi
fi

#Check for / install ffprobe
if ! command -v ffprobe &> /dev/null
then
    echo "Attempting to download ffmpeg (utility for app- and file-icon generation)..."
    #Idea for system check from https://stackoverflow.com/questions/3466166/how-to-check-if-running-in-cygwin-mac-or-linux
    unameOut="$(uname -s)"
	case "${unameOut}" in
	    Linux*)     machine=Linux;;
	    Darwin*)    machine=Mac;;
	    *)          machine="UNKNOWN:${unameOut}"
	esac
	
	if [[ "${machine}" == "Mac" ]]
	then
		#Mac version
		mkdir ./generated
		curl -L https://evermeet.cx/ffmpeg/getrelease/ffprobe/zip > "./generated/ffprobe.zip"
	    unzip ./generated/ffprobe.zip -d ./generated
	    chmod +x ./generated/ffprobe
	    
		echo "Trying to make ffprobe available globally..."
	    echo "Please authenticate:"
	    sudo mv ./generated/ffprobe /usr/local/bin/ffprobe
	else
		#Linux version - no automatic download available yet
        echo
        echo "You seem to be installing Kalzit on a Linux system."
        echo "We can not automatically install ffmpeg on Linux yet, so you should do that manually."
        echo
        echo "Please download Ffmpeg (which should include ffprobe) and install it: https://ffmpeg.org/download.html"
        echo "After that, run this script again to continue the installation"
        echo
        exit
	fi
fi

if ! command -v youtube-dl &> /dev/null
then
	echo "Trying to make youtube-dl available globally..."
	echo "Please authenticate:"
	sudo curl -L https://yt-dl.org/downloads/latest/youtube-dl -o /usr/local/bin/youtube-dl
	
	echo "Trying to make youtube-dl executable..."
	echo "Please authenticate:"
	sudo chmod a+rx /usr/local/bin/youtube-dl
fi

#Stuff that uses 'node' and 'npm'
bash ./utilities/installer/runWithNodejs.sh $@

echo
echo The Kalzit installation should be done now.
echo If you did not have NodeJS installed before,
echo please open a new terminal window to make sure all commands are working.
echo Have fun!
echo
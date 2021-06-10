npm install follow-redirects xmldom

#Global utility installation (needed for building)
##Check which utilities are needed
utilitiesNeeded=0
if ! command -v terser &> /dev/null
then
	terserPackage="terser"
	utilitiesNeeded=1
fi
if ! command -v uglifycss &> /dev/null
then
	uglifycssPackage="uglifycss"
	utilitiesNeeded=1
fi
if ! command -v markdown &> /dev/null
then
	markdownPackage="markdown-to-html"
	utilitiesNeeded=1
fi

##If a new installation of global tools is required, do that
if [[ $utilitiesNeeded == 1 ]]
then
	echo "Trying to install some global commands which are needed for building Kalzit."
	echo $terserPackage $uglifycssPackage $markdownPackage
	echo "Please authenticate:"
	sudo npm install -g $terserPackage $uglifycssPackage $markdownPackage $ffbinariesPackage
fi

mkdir ./generated

bash ./utilities/installer/parts/nogit.sh
bash ./utilities/installer/parts/cli.sh

#Create the app.redirect file (to support the "old" /app handle, from previous server versions)
echo ./apps > ./app.redirect

./cli build everything

#Attempt do link the cli file to "kalzit"
#If the --no-link option is the first parameter, skip this step
if  [ "$1" != "--no-link" ]
then
	if ! command -v kalzit &> /dev/null
	then
		echo
		echo We will now attempt to make the "kalzit" command accessible anywhere.
		echo This requires root privileges - please authenticate.
		sudo ln -sf "$(pwd)/kalzit" /usr/local/bin/kalzit
	fi
fi
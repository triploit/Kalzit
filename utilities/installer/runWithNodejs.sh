#Install packages locally for this project (not too bad if it does not work)
npm install follow-redirects xmldom diskspace

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
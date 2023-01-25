#Figure out what kind of Unix we are running on - important for choosing the right installer file
unameOut="$(uname -s)"
#Replace "Darwin" with "Mac"
osName="${unameOut/Darwin/Mac}"

#This is a function for showing file content and prompting user action
manualActionNeeded=0
promptManualAction () {
	file="$1"
	
	cat $folder/installHint.txt
	echo
	manualActionNeeded=1
}

#This routine is here for installing a single dependency - parameter is the folder containing the dependency description, like an installer file
installDependencyByFolder () {
	folder=$1
	
	#Check if the folder includes an installer script
	if [ -f $folder/sudoInstaller.sh ]; then
		#The dependency can be installed automatically - do that
		echo We need to install the program \'$(basename $folder)\'. Please authenticate:
		sudo bash $folder/sudoInstaller.sh
	elif [ -f $folder/sudoInstaller$osName.sh ]; then
		#We have an installer script specifically for the current OS - use that
		echo We need to install the program \'$(basename $folder)\'. Please authenticate:
		sudo bash $folder/sudoInstaller$osName.sh
	elif [ -d $folder/$osName ]; then
		#We have a folder with separate installer scripts for different package managers. Loop them.
		for packageManagerSupportFile in $folder/$osName/*.sh; do
			local packageManagerName=$(basename "${packageManagerSupportFile%.*}")
			
			#If the package manager command exists, just use it
			if command -v $packageManagerName &> /dev/null
			then
				echo We need to install the program \'$(basename $folder)\'. Please authenticate:
				sudo bash $folder/$osName/$packageManagerName.sh
				
				#Now the installation should be complete. If it is not, put up a prompt for manual action
				if ! command -v $(basename $folder) &> /dev/null
				then
					promptManualAction "$folder/installHint.txt"
				fi
				
				break
			fi
		done
	else
		promptManualAction "$folder/installHint.txt"
	fi
}

runInstallersOnLevel () {
	local level=$1
	#Loop through ./utilities/installer/parts/dependencies/$level
	for subFolder in ./utilities/installer/parts/dependencies/$level/* ; do
		#Get the name of that folder, which corresponds to the command name of the dependency
		local dependencyName=$(basename $subFolder)
		
		#Check if the dependency does not exists - that means we have to do something
		if ! command -v $dependencyName &> /dev/null
		then
			installDependencyByFolder $subFolder
		fi
		
	done
}

#This is the main installation routine
#Make console output look better
echo

#We have a few incrementally numbered folders in ./utilities/installer/parts/dependencies - loop through them, until a folder with that number can not be found
folderCounter=0
while : ; do
	#Check if the folder exists
	if [ -d "./utilities/installer/parts/dependencies/$folderCounter" ]; then
		#Run the dependency installers within that folder
		runInstallersOnLevel $folderCounter
		
		#Quit with a hint about what the user has to do
		if [ "$manualActionNeeded" -eq "1" ]; then
			echo "Please install the mentioned dependencies manually - to see the missing dependencies / complete the installation, run this script again."
			exit
		fi
		
		#Increment "folderCounter"
		folderCounter=$((folderCounter+1))
	else
		break
	fi
done
echo
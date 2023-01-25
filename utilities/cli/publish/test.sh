#We have to build the user root folder here

#Use rsync to replace the user root with a new Kalzit installation
testSource="${1-$(./cli get localRootFolder)}"

#-raz parameter from https://electrictoolbox.com/rsync-ignore-existing-update-newer/
rsync -raz -v "$testSource/" "$(./cli get userRootFolder)/" --delete
#We have to build the system root folder here
sudo ./cli new systemRootFolder

#-raz parameter from https://electrictoolbox.com/rsync-ignore-existing-update-newer/
sudo rsync -raz -v "$(./cli get userRootFolder)/" "$(./cli get systemRootFolder)/"  --delete

#Make the root user own that folder
sudo chown -R root "$(./cli get systemRootFolder)"
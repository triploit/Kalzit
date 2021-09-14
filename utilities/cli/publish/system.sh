#We have to build the system root folder here
sudo ./cli new systemRootFolder

#Use rsync to copy the user root into the system root
sudo rsync -a -vv "$(./cli get userRootFolder)/" "$(./cli get systemRootFolder)/"

#Make the root user own that folder
sudo chown -R root "$(./cli get systemRootFolder)"
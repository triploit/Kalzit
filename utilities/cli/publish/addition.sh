#We have to build the user root folder here

#Use rsync to "merge" the local and system root into the user root
testSource="${1-$(./cli get localRootFolder)}"

rsync -a -v "$(./cli get systemRootFolder)/" "$testSource/" "$(./cli get userRootFolder)/" --ignore-existing
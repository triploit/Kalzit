# Cleaning level 5 is supposed to clear system data that have become irrelevant (old logs, package manager data, etc.)
# This can free up a lot of space without having side effects later
# (if we were to completely clean these files, we would have to wait longer later when updating - that will only be done when needed)

if [ "root" = "$(whoami)" ]
then
    if command -v apt-get &> /dev/null
    then
        echo Removing old APT packages ...
        sudo apt-get -y autoremove
        
        echo Removing old APT packages from cache ...
        sudo apt-get -y autoclean
    fi
    
    if command -v journalctl &> /dev/null
    then
    	echo Removing more than one year old system logs ...
    	sudo journalctl --vacuum-time=365d
    fi
else
	echo "If you run this script as root, it can be more effective"
fi
# Cleaning level 7 is supposed to clear system data rather aggressively (package manager data)
# This can free up a lot of space, but it has the side effect of slower system update speeds later.

if [ "root" = "$(whoami)" ]
then
	if command -v apt-get &> /dev/null
	then
	    echo Removing all APT packages from cache ...
	    sudo apt-get -y clean
	fi
	
	if command -v journalctl &> /dev/null
	then
		echo Removing more recent system logs ...
		sudo journalctl --vacuum-time=3d
	fi
else
	echo "If you run this script as root, it can be more effective"
fi
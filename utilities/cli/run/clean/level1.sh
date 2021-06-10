#Remove old server logs
rm ./generated/logs/managed/old/*.txt &> /dev/null

#Remove unused Linux packages
sudo apt-get -y autoremove --purge
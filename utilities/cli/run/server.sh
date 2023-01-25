mkdir ~/.kalzit &> /dev/null
mkdir ~/.kalzit/generated &> /dev/null
mkdir ~/.kalzit/generated/logs &> /dev/null

if ! command -v node &> /dev/null
then
    echo "Command 'node' could not be found."
    echo "If you see this message just after installing Kalzit, please open a new terminal window and try it again from there."
    echo "Otherwise, try to install NodeJS yourself"
    exit
fi

#Before starting the server, save a potential recent log file (and remove older ones)
mkdir ~/.kalzit/generated/logs/managed &> /dev/null
mkdir ~/.kalzit/generated/logs/managed/old &> /dev/null
mv ./generated/logs/managed/current-server-log.txt "./generated/logs/managed/old/server-log-prior-$(date +'%Y-%m-%d_%H.%M.%S').txt" &> /dev/null

bash utilities/cli/run/blockingServer.sh "$@" &> ./generated/logs/managed/current-server-log.txt &
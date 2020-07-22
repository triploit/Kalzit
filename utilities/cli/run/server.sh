mkdir ./generated/logs &> /dev/null

if ! command -v node &> /dev/null
then
    echo "Command 'node' could not be found."
    echo "If you see this message just after installing Kalzit, please open a new terminal window and try it again from there."
    echo "Otherwise, try to install NodeJS yourself"
    exit
fi

bash utilities/cli/run/blockingServer.sh &> "./generated/logs/server-log-$(date +'%Y-%m-%d_%H.%M.%S').txt" &
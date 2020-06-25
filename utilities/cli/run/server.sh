mkdir ./generated/logs &> /dev/null
bash utilities/cli/run/blockingServer.sh &> "./generated/logs/server-log-$(date +'%Y-%m-%d_%H.%M.%S').txt" &
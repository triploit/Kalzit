# Creates the command-line interface ("./cli" from the root folder, "kalzit" from everywhere)

chmod +x ./cli

echo \#!/bin/bash > ./kalzit
echo cd \"$(pwd)\" >> ./kalzit
echo "./cli \$@" >> ./kalzit

chmod +x ./kalzit
chmod +x ./nodejs/files/httpServer
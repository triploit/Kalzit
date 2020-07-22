npm install follow-redirects xmldom
npm install -g terser
npm install -g uglifycss
npm install -g markdown-to-html

bash ./utilities/installer/parts/nogit.sh
bash ./utilities/installer/parts/cli.sh

mkdir ./generated
./cli build everything

echo
echo We will now attempt to make the "kalzit" command accessible anywhere.
echo This requires root privileges - please authenticate.

#Attempt do link the file without root access first
ln -sf "$(pwd)/kalzit" /usr/local/bin/kalzit
sudo ln -sf "$(pwd)/kalzit" /usr/local/bin/kalzit
#Download the ffmpeg ZIP file
mkdir ./generated
curl -L https://evermeet.cx/ffmpeg/getrelease/ffprobe/zip > "./generated/ffprobe.zip"

#Unzip ffprobe and make it executable
unzip -qq ./generated/ffprobe.zip -d ./generated
chmod +x ./generated/ffprobe

#Make it available globally
sudo mv ./generated/ffprobe /usr/local/bin/ffprobe
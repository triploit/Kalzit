#Download the ffmpeg ZIP file
mkdir ./generated
curl -L https://evermeet.cx/ffmpeg/getrelease/zip > "./generated/ffmpeg.zip"

#Unzip ffmpeg and make it executable
unzip -qq ./generated/ffmpeg.zip -d ./generated
chmod +x ./generated/ffmpeg

#Make it available globally
sudo mv ./generated/ffmpeg /usr/local/bin/ffmpeg
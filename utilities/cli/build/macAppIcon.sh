input="$1"
output="$2"

#First step: create an image with rounded corners
corner_radius=100
ffmpeg -y -i "$input" -filter_complex "geq=lum='p(X,Y)':a='if(gt(abs(W/2-X),W/2-${corner_radius})*gt(abs(H/2-Y),H/2-${corner_radius}),if(lte(hypot(${corner_radius}-(W/2-abs(W/2-X)),${corner_radius}-(H/2-abs(H/2-Y))),${corner_radius}),255,0),255)'" "$output"

#Second step: Add a transparent background to that image
ffmpeg -f lavfi -i "color=c=0xffffff@0x00:s=512x512,format=rgba" \
       -vf "movie=$output,scale=448x448[inner];[in][inner]overlay=32:32:shortest=1[out]" \
       -y "$output"
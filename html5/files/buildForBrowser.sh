#!/bin/bash
# This script is only ever used in html/files/build.sh

input=$1
out=$2
options="${@:3}"

echo "<html><head>" > "$out"

#Default head
cat "html5/files/head.html" >> "$out"

#Script tags
bash "html5/files/listHtmlScriptTags.sh" $options >> "$out"

#Styling
cat "assets/stylesheets/html5/_min.html" >> "$out"

#Body from first argument
echo "</head><body>" >> "$out"
cat  "html5/files/$input" >> "$out"
echo "</body></html>" >> "$out"

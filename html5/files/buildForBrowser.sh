#!/bin/bash
input=$1
out=$2
options="${@:3}"

echo "<html><head>" > "$out"

#Script tags
bash "html5/files/listHtmlScriptTags.sh" --platform html5 $options >> "$out"

#Styling
echo "<style>" >> "$out"
cat "assets/stylesheets/html5/_min.css" >> "$out"
echo "</style>" >> "$out"

#Default head
cat "head.html" >> "$out"

#Body from first argument
echo "</head><body>" >> "$out"
cat  "html5/files/$input" >> "$out"
echo "</body></html>" >> "$out"
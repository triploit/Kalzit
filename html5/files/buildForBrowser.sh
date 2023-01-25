#!/bin/bash
input=$1
out=$2
options="${@:3}"

echo "<html><head>" > "$out"

#Default head
cat "html5/files/head.html" >> "$out"

#Script tags
bash "html5/files/listHtmlScriptTags.sh" --platform html5 $options >> "$out"

#Styling
cat "assets/stylesheets/html5/_min.html" >> "$out"

#Body from first argument
echo "</head><body>" >> "$out"
cat  "html5/files/$input" >> "$out"
echo "</body></html>" >> "$out"
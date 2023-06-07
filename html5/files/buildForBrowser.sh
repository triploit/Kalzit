#!/bin/bash
# This script is only ever used in html/files/build.sh
# It builds a HTML skeleton with placeholders that will be filled by nodejs/files/buildAppHtml.txt

input=$1
out=$2
options="${@:3}"

echo "<html><head>" > "$out"

#Default head
cat "html5/files/head.html" >> "$out"

#Script tags
echo '<script>$scripts$</script>' >> "$out"

#Styling
cat "assets/stylesheets/html5/_min.html" >> "$out"

#Body from first argument
echo "</head><body>" >> "$out"
cat  "html5/files/$input" >> "$out"
echo "</body></html>" >> "$out"

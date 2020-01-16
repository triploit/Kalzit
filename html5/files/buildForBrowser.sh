#!/bin/bash
input=$1
out=$2

bash "html5/files/listHtmlScriptTags.sh" html5ui html5js html5 packagesJs packages > "$out"
cat  "html5/files/$input" >> "$out"
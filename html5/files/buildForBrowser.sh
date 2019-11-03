#!/bin/bash
input=$1
out=$2

bash "html5/files/listHtmlScriptTags.sh" packages html5 > "$out"
cat  "html5/files/$input" >> "$out"
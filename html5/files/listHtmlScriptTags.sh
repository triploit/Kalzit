#!/bin/bash
rootFolder="$(pwd)"
cd nodejs/files
bash run.sh "$rootFolder/html5/files/listHtmlScriptTags.txt" --kalzit-root-folder "$rootFolder" "$@"
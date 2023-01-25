#!/bin/bash
rootFolder="$(pwd)"
./cli run nodeApp "$rootFolder/html5/files/listHtmlScriptTags.txt" --kalzit-root-folder "$rootFolder" "$@"
echo "Minifying core language files"

terser $(< ../bootstrap/platformScripts.txt) --keep-fnames --output ./_min.js
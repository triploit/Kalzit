echo "Minifying core language files"

terser $(< ../bootstrap/platformScripts.txt) --keep-fnames --mangle --output ./_min.js
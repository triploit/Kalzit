echo "Minifying core language files"

bash ../../utilities/cli/command/terser.sh $(< ../bootstrap/platformScripts.txt) --keep-fnames --mangle --output ./_min.js
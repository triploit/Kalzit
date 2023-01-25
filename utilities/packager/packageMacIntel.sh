# Creates a standalone Kalzit package for Intel macOS

bash "$(dirname $0)/../dependencies/nogit/macIntel.sh"
cd "$(dirname $0)/../.."

zip -r --symlinks "$1" .
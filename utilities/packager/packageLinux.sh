# Creates a standalone Kalzit package for X86 Linux

bash "$(dirname $0)/../dependencies/nogit/linuxX86.sh"
cd "$(dirname $0)/../.."

zip -r --symlinks "$1" .
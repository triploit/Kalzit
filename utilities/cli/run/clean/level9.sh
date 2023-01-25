# Cleaning level 9 is supposed to fully remove all folders with a .deleted.txt marker. Essentially an "empty trash bin" command
# This is very likely to be effective in freeing up storage, so it is allowed to take a bit of time

./cli run nodeApp "$(pwd)/utilities/cli/run/clean/level9.txt" --root-folder "$(pwd)"
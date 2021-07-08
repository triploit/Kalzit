# Cleaning level 6 is the first destructive level. It is supposed to fully remove deleted file versions, except the most recent one. Essentially a friendlier "empty trash bin" command
# This is very likely to be effective in freeing up storage, so it is allowed to take a bit of time

./cli run nodeApp "$(pwd)/utilities/cli/run/clean/level6.txt" --root-folder "$(pwd)"
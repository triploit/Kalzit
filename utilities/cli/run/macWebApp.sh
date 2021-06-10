appUrl="$1"

#All of the commands below will be run ONLY if the one before did not work (because of the || operator)
#Use Chromium; the best option
open -na Chromium --args --app="$appUrl"

#Try to open Firefox
|| open -na Firefox --args --new-window "$appUrl"

#Just use the default browser; the worst option
|| open "$appUrl"
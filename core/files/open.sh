if ! type "open" > /dev/null; then
	xdg-open $@
else
	open $@
fi
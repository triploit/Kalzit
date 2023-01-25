uiTitle: "Home".

!if ((2 eq length: standardApps) & (not: developerMode)) {
	launchAppName: "files"
}.
print do:uiHomeScreen
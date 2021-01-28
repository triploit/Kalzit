`!if (void eq storageLoadString: $calcitUserId) {redirect: "/app/login"}.`

print: {} uiButton "Logout".
print: uiColumns:
	[@(backgroundColor (RgbColor red) % 1,5) @(percentWidth 100) @(pxHeight 55) uiContainer: ()];
	[@(backgroundColor $lighterTwilightAccentColor of greenColorCombination) @(percentWidth 100) @(pxHeight 55) uiContainer: ()];
	[@(backgroundColor $lighterTwilightAccentColor of blueColorCombination) @(percentWidth 100) @(pxHeight 55) uiContainer: ()];
	[@(backgroundColor $lighterTwilightAccentColor of yellowColorCombination) @(percentWidth 100) @(pxHeight 55) uiContainer: ()];
	[@(backgroundColor $lighterTwilightAccentColor of magentaColorCombination) @(percentWidth 100) @(pxHeight 55) uiContainer: ()];
	[@(backgroundColor $lighterTwilightAccentColor of cyanColorCombination) @(percentWidth 100) @(pxHeight 55) uiContainer: ()]
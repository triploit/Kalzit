terser $(echo ./packages/*.js) $(echo ./packages/*/*.js) --output _min.js
terser $(echo ./plots/packages/*.js) --output ./plots/_min.js
terser $(echo ./advancedImageStuff/packages/*.js) --output ./advancedImageStuff/_min.js
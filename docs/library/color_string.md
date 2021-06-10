# color_string
## argumentList
_color
## comment

Type function for string representations of colors.
This function accepts two kinds of inputs:
1. If the input is a string, it is returned.
2. If the input is anything else, it is attempted to convert it to a RGBA Color (Red, Green, Blue, Alpha). That color is then converted to a string of the form "rgba(r,g,b,a)".

Usage example:
$firstColor = "red". `result is "red"`
$secondColor = 1;2;3. `result is "rgba(1,2,3,1)"`

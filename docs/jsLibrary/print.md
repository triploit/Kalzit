## comment
The standard print function - for showing output to the user.
It takes its parameter, generates a simple graphical representation (usually just text) and shows it on the screen (for web applications, on the website itself).

Usage example:
```kalzit
print: "Any text".
print: 4.
```

This function can also be used to show UI elements on the screen:
```kalzit
print: uiContainer: "Yay".
```

However, elements which have a possible UI representation do not get automatically converted to that.
If you want to use a more visual UI when outputting values, use "visualize" instead.
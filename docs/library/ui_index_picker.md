# ui_index_picker
## comment

Creates a picker control (which lets the user pick a value) based on a list of options (second parameter).
The chosen option is represented as an index (0 for the first, 1 for the second and so on).
Whenever the choice changes, a callback (first parameter) is called with the selected index (a number) as its parameter.

Usage example (simply displaying the chosen index in a popup):

```kalzit
$callback = popupMessage. `Just show something`.
$options = "First";"Second";"Third".

print: callback uiIndexPicker options.

void
```
## comment

Creates a picker control (which lets the user pick a value) based on a list of options (second parameter).
The chosen option is represented as an index (0 for the first, 1 for the second and so on).
Whenever the choice changes, a reference (first parameter) is automatically updated with the selected index (a number) as its new value.

The reference pointing to the active index can also be used to change the initial selection.
For example, if you want the second item to be selected when the UI element is first displayed, set your reference value to 1.
You should also populate the index variable (which the reference points to) with a valid index value.
If the value of your index variable is (or becomes) an invalid index number, a blank selection will be shown to the user.

Usage example (showing two ui elements - the second one displays the currently selected index):

```kalzit
$selection = 1. `Remove for blank initial selection`.
$selectionRef = reference: $selection.

$options = "First";"Second";"Third".

`The picker control`
print: selectionRef uiIndexReferencePicker options.
`Shows the currently selected index`
print: uiShowVariable: selectionRef.

void
```
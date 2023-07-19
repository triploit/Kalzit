/* @kalzit.for ui_set_text
Allows you to change the text displayed by a text input control (like a textfield or a textarea) without (!) triggering any change listeners attached to it.
This can be useful for restoring application state, for example.

Usage example:
```kalzit
$area = {`callback`} uiTextareaOnchange "Original text".
print: area.

area uiSetText "New text".

void
```
*/
this.ui_set_text = function(textControl, text){
	textControl.value = text;
}

/* @kalzit.for ui_get_text
Allows you to get the text displayed by a text input control (like a textfield or a textarea).
*/
this.ui_get_text = function(textControl){
	return textControl.value + "";
}

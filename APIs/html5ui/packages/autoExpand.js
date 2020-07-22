/* @kalzit.for expand_with_content
Makes a text area automatically adapt its size when the user changes the content.
Basically, the number of content lines is taken and used to calculate the height of the area.
This is supposed to make the text area be big enough to prevent it from scrolling.

However, that behavior is not exactly intelligent at the moment.
As an example automatic line wraps are ignored, even though they technically add a displayed line.

Usage example:
```
$area = (`your text area`).
print: @expandWithContent area.
```
*/
this.expandWithContent = function(textarea){
	function update(){
		textarea.rows = textarea.value.split("\n").length || 1
	}
	
	textarea.addEventListener("change", update, false);
	textarea.addEventListener("keyup", update, false);
	update();
}
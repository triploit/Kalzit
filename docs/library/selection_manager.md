# selection_manager
## argumentList
config
## comment

This is a function to take care of selected items.
It is especially intended for things like selection management, where wen you select one list item, the change needs to be reflected in both the selected and the deselected item.

Fields of the `config` object:
* onSelect (optional): gets triggered when an item becomes selected. First parameter is the newly selected item.
* onDeselect (optional): gets triggered when an item becomes deselected. First parameter is the newly deselected item.
* currentSelection (optional): a list of pre-selected items.

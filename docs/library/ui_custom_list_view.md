# ui_custom_list_view
## argumentList
_options
config
## comment

* `_options` is a modifiable list of items to display in the list view
* `config` is an object with various possible fields (listed below)

Fields of `config`:
* `itemViewFactory` (optional): a function which turns a value (from the list) into a view that represents it. The returned view will show up in the list view.
* `itemSpacing` (optional): the distance between two list items in pixels. `0` by default.
* `sidePadding` (optional): the size of the empty space to the left and the right of the list view items. If this is 10, there will be 10 empty pixels to the left, then the list content, then 10 empty pixels to the right. Default is 0.

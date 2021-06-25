# ui_kmp_list_item
## argumentList
file
config
## comment

* `file` is a KMP object (already parsed, not in JSON format)
* `config` is a configuration object

Fields of `config`:
* `forcedThumbnail` (optional): defines a fixed thumbnail displayed by this list entry
* `defaultThumbnail` (optional): defines a default icon which will be used if no fixed icon is specified by the configuration or the KMP object,
* `onTap` (optional): defines an action which will be triggered if the user taps on this list item. Gets the KMP object (`file`) as its parameter.
* `titleGenerator` (optional): defines how to get a title from a KMP object. Function which gets the KMP object as its parameter. Default returns the standard KMP title.
* `additionalActions` (optional): a list of pairs, where each pair contains a string (first item) and a function (second item). These pairs are used to construct an action picker ("three dot button"), where the string specifies the title of each action and the function specifies the action itself. When an action is selected by the user, the appropriate function is called with the KMP object of the medium the action is applied to (what "onTap" would get when the medium is selected)

# ui_kmp_list_with_big_thumbnails
## argumentList
interactionConfig
videoList
## comment

Creates a list view from a KMP collection, with (relatively large) thumbnails and titles. Additionally, you can specify actions for tapping on a medium and add other interaction options.

Parameters:
* `interactionConfig` is an object with multiple fields (listed below).
* `videoList` is a KMP object which either represents a collection ($kind is "collection") or a single medium (in this case, the medium will be shown as a one-item list).

More details on the "interactionConfig" object:
* `onTap` is a function which is called when the user selects a medium from the list. It gets the KMP object of that medium as its first parameter.
* `additionalActions` is a list of pairs, where each pair contains a string (first item) and a function (second item). These pairs are used to construct an action picker ("three dot button"), where the string specifies the title of each action and the function specifies the action itself. When an action is selected by the user, the appropriate function is called with the KMP object of the medium the action is applied to (what "onTap" would get when the medium is selected)
* `allowTitleOverflow` is a boolean value which specifies if the title can take up more than one line. The default value is true. If this is false, titles can be cut off.
* `centerTitle` is a boolean value which specifies if the title is centered. Default value is true - if false, the title is aligned to the left.

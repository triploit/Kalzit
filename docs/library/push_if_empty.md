# push_if_empty
## argumentList
_list
_item
## comment

Pushes an item (first parameter) to a modifiable list, but only if that list (second parameter) is empty.

Usage example:
$ml = ModifiableList: (). `Empty`.
ml pushIfEmpty "Default Item".
ml pushIfEmpty "Another Item".
`The list will only contain "Default Item"`

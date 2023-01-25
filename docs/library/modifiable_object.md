# modifiable_object
## argumentList
_originalObject
## comment

Produces a utility to create objects by adding properties. The benefit here is that you do not need to add all properties at once. This is very similar to a standard "map" object.

The function parameter for creating this is a normal object - or just void. All properties of that object will be added to the modifiable one.

The return value is an object with the following properties:
* `push` - function that takes a key and a value and adds it to the object
* `removeProperty` - function that takes a key and removes it from the object
* `remove` - function that takes a key and a value and removes all exact matches from the object
* `getObject` - returns a "normal" objects with all the added fields
* `clear` - removes all fields from the modifiable object
* `isProperty` - takes a key value and returns if that is an existant property
* `getProperty` - takes a key and returns the value of it

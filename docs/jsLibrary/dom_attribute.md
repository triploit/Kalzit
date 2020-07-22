## comment
 
 Returns the value of an attribute which was given to a Tag.
 For example, in the case of <a href="test"></a>, the attribute "href" has the value test.
 If no attribute with the given name can be found, an empty list (equivalent to "void"), is returned.

 Usage: $viewBox domAttribute dom.
 If the attribute was found, a string is returned - otherwise, it is an empty list.
/* @kalzit.for random
A parameter-less function which contains a random number between 0 and 1.

Usage example:
	```
	$a = !random.
	
	$diceThrow = {Int: 1 + 6 * !random}.
	!diceThrow `Produces a n integer between 1 and 6`
	```
*/
this.random = Math.random;
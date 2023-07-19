/* @kalzit.for calcit_compile
Compiles a JSON representation of a given piece of Kalzit code.
The JSON representation can be run by GLang.evaluateTree (usable in JavaScript)

Additionally to specifying the code to compile (first parameter), you can add an optional boolean parameter to tell the function if the result should be slightly optimized.
If that parameter is true (default is false), the operation can take a little bit longer, but the resulting JSON can be interpreted faster.

Usage example:
```kalzit
$json ? String = calcitCompile: "code".
$optimized ? String = "code" calcitCompile true.
```
*/
this.calcit_compile = function(code, optimized){
	return JSON.stringify(GLang.prepareTree(GLang.generateTree(code, optimized)))
}

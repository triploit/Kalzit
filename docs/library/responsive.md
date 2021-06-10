# responsive
## type
function(env, args){
var functionEnvironment = GLang.createFunctionScope(defaultEnv, argumentList, args);

var result = GLang.evaluateTree(tree, functionEnvironment);
//Apply type (if present)
return type ? GLang.callObject(type, env, [result]) : result;
}
# set_length
## type
function(env, args){
var functionEnvironment = GLang.createFunctionScope(defaultEnv, argumentList, args);

var result = GLang.evaluateTree(tree, functionEnvironment);
//Apply type (if present)
return type ? GLang.callObject(type, env, [result]) : result;
}
## deprecated
Everything that has todo with pseudo-arrays will be removed, because they never worked properly
## comment
Produces an annotation with the key "length" and a given value.
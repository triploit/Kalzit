GLang.dr.qdSet("parse_json", {value:function(env, args){
    //console.log((args[0].value) instanceof Array);
    if((args[0].value) instanceof Array && args[0].value.length === 0) {
        return GLang.voidValue;
    }
    
    //Check if the input is a string
    if(args[0].value + "" !== args[0].value) {
        throw new Error("parseJson did not get a string as input: " + JSON.stringify(args[0]));
    }
	return GLang.wrapJsToValue(JSON.parse(args[0].value + ""));
}});
GLang.dr.qdSet("obj_to_json", {value:function(env, args){
	return GLang.stringValue(JSON.stringify(GLang.wrapValueToJsObject(args[0])))
}});

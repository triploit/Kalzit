GLang.dr.qdSet("eval_globally", {value:function(env, args){
    //Get the code we want to evaluate
    var code = args[0].value + "";
    //Evaluate the code
    return GLang.eval(code);
}, display: DISPLAY_FUNCTION});

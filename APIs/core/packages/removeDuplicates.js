;(function(){
    function uniques(array) {
        var result = [], val, ridx;
        outer:
        for (var i = 0, length = array.length; i < length; i++) {
            val = array[i];
            ridx = result.length;
            while (ridx--) {
              if (GLang.eq(val.value, result[ridx].value)) continue outer;
            }
            result.push(val);
        }
        return result;
    }
    
    GLang.defaultRuntimeEnvironment.qdSet("remove_duplicates", {value:function(env, args){
    	return {value:uniques(args[0].value)}
    }});
})();

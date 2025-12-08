;(function(){
    function uniques(array, isEqual) {
        var result = [], val, ridx;
        outer:
        for (var i = 0, length = array.length; i < length; i++) {
            val = array[i];
            ridx = result.length;
            while (ridx--) {
              if (isEqual(val, result[ridx])) continue outer;
            }
            result.push(val);
        }
        return result;
    }
    
    GLang.dr.qdSet("remove_duplicates", {value:function(args){
        var isEqual = (a,b) => GLang.eq(a.value, b.value);
        if(args[1]) {
            const kalzitFunction = args[1];
            isEqual = (a,b) => GLang.call(kalzitFunction, [a,b]).value === 1;
        }
        return {value:uniques(args[0].value, isEqual)}
    }});
})();

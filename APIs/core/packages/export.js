GLang.dr.qdSet("export_named_value", {value:function(args) {
    const name = args[0].value + "";
    const value = args[1];
    
    GLang.exported[name] = value;

    return GLang.voidValue;
}});

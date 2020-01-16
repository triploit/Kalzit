GLang.defaultRuntimeEnvironment.setInnerVariable("length",{value:function(env,args){var array=args[0];var lengthAnnotation=GLang.getFirstAnnotation(array,GLang.stringValue("length"));if(lengthAnnotation){return lengthAnnotation}else if(array.value instanceof Array){return{value:array.value.length}}else{return{value:1}}}});GLang.defaultRuntimeEnvironment.setInnerVariable("calcitUnifyName",{value:function(env,args){return GLang.stringValue(GLang.defaultRuntimeEnvironment.unifyStringName(args[0].value+""))},display:"function"});GLang.defaultRuntimeEnvironment.setInnerVariable("calcitAnnotations",{value:function(env,args){return{value:args[0].annotations||[]}},display:"function"});GLang.defaultRuntimeEnvironment.setInnerVariable("calcitAddAnnotation",{value:function(env,args){GLang.addAnnotation(args[1],args[0]);return args[1]},display:"function"});GLang.defaultRuntimeEnvironment.setInnerVariable("calcitSetAnnotation",{value:function(env,args){GLang.setAnnotation(args[1],args[0]);return args[1]},display:"function"});GLang.defaultRuntimeEnvironment.setInnerVariable("calcitAddComment",{value:function(env,args){GLang.addAnnotation(args[1],{value:[GLang.stringValue("comment"),args[0]]});return args[1]},display:"function"});GLang.defaultRuntimeEnvironment.setInnerVariable("calcitSetType",{value:function(env,args){GLang.addAnnotation(args[1],{value:[GLang.stringValue("type"),args[0]]});return args[1]},display:"function"});GLang.defaultRuntimeEnvironment.setInnerVariable("parseCookieNames",GLang.wrapJsToValue(GLang.listCookies));GLang.defaultRuntimeEnvironment.setInnerVariable("parseCookieValue",GLang.wrapJsToValue(GLang.getCookie));GLang.defaultRuntimeEnvironment.setInnerVariable("getCurrentDate",{value:function(){return{value:(new Date).getTime()}}});GLang.defaultRuntimeEnvironment.setInnerVariable("dateToUtc",{value:function(env,args){return GLang.stringValue(new Date(args[0].value).toUTCString())}});GLang.defaultRuntimeEnvironment.setInnerVariable("filter",{value:function(env,args){var result=[];for(var i=0;i<args[1].value.length;i++){var entry=args[1].value[i];if(GLang.callObject(args[0],env,[entry]).value){result.push(entry)}}return{value:result}}});GLang.defaultRuntimeEnvironment.setInnerVariable("generateGuid",{value:function(){var S4=function(){return((1+Math.random())*65536|0).toString(16).substring(1)};return GLang.stringValue(S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4())}});GLang.defaultRuntimeEnvironment.setInnerVariable("parseJson",{value:function(env,args){try{return GLang.wrapJsToValue(JSON.parse(args[0].value+""))}catch(e){return GLang.voidValue}}});GLang.defaultRuntimeEnvironment.setInnerVariable("objToJson",{value:function(env,args){return GLang.stringValue(JSON.stringify(GLang.wrapValueToJsObject(args[0])))}});GLang.defaultRuntimeEnvironment.setInnerVariable("listenVariable",{value:GLang.arrayFun(function(env,args){var varRef=args[0];if(varRef.display!=="reference"){throw new Error("listenVariable needs a reference as the first parameter")}var varEnv=varRef.environment;var varName=varRef.value;varEnv.registerVariableListener(varName,function(){GLang.callObject(args[1],env,[varEnv.resolveName(varName)])});return{value:0,display:"none"}}),display:"function"});GLang.defaultRuntimeEnvironment.setInnerVariable("pmListRegisteredPackages",{value:function(){return GLang.wrapJsToValue(GLang.packageManager.registeredPackages)}});GLang.defaultRuntimeEnvironment.setInnerVariable("pmListInstalledNames",{value:function(){return GLang.wrapJsToValue(GLang.defaultRuntimeEnvironment.innerVariables.map(function(v){return v.varName}))}});GLang.defaultRuntimeEnvironment.setInnerVariable("pm_add_language",{value:function(env,args){for(var i=0;i<GLang.packageManager.supportedLanguages.length;i++){if(GLang.packageManager.supportedLanguages[i].langName===args[1].value+"")throw new Error("The language you are trying to register already exists")}GLang.packageManager.supportedLanguages.push({langName:args[1].value+"",langRunner:function(url,x){GLang.callObject(args[0],env,[GLang.stringValue(url),GLang.stringValue(x)])}});return GLang.voidValue},argumentList:["evaluator","name"],display:"function"});GLang.defaultRuntimeEnvironment.setInnerVariable("pmLoadPackage",GLang.wrapJsToValue(GLang.packageManager.loadPackageSync));(function(){function uniques(array){var result=[],val,ridx;outer:for(var i=0,length=array.length;i<length;i++){val=array[i];ridx=result.length;while(ridx--){if(GLang.eq(val.value,result[ridx].value))continue outer}result.push(val)}return result}GLang.defaultRuntimeEnvironment.setInnerVariable("removeDuplicates",{value:function(env,args){return{value:uniques(args[0].value)}}})})();GLang.defaultRuntimeEnvironment.setInnerVariable("runLater",{value:function(env,args){GLang.flagQueue.push(function(){GLang.callObject(args[0],env,[])});GLang.runFlagQueue();return GLang.voidValue}});(function(){GLang.defaultRuntimeEnvironment.setInnerVariable("str_starts_with",{value:GLang.arrayFun(function(env,args){return{value:args[1].value.startsWith(args[0].value)?1:0}})});GLang.defaultRuntimeEnvironment.setInnerVariable("str_ends_with",{value:GLang.arrayFun(function(env,args){return{value:args[1].value.endsWith(args[0].value)?1:0}})});GLang.defaultRuntimeEnvironment.setInnerVariable("str_split",{value:GLang.arrayFun(function(env,args){var results=args[1].value.split(args[0].value);for(var i=0;i<results.length;i++){results[i]=GLang.stringValue(results[i])}return{value:results}})});GLang.defaultRuntimeEnvironment.setInnerVariable("str_sub",{value:function(env,args){var from=GLang.at(0,args[0]).value;var to=args[1].value.length;if(args[0].value.length===2){to=args[0].value[1].value}return GLang.stringValue(args[1].value.substring(from,to))}})})();
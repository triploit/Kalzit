print: "Trying to run Kalzit app (on client): " + fname.
$appScript = 'GLang.evaluateTree(' + ((fileContent: fname) calcitCompile true `optimized`) + ', GLang.defaultRuntimeEnvironment);'.
resultRef = ("$app$";appScript) strReplace fileContent: "./generated/_browser_app_singlefile.html".
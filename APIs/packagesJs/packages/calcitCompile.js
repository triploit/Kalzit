this.calcitCompile = function(code, optimized){
	return JSON.stringify(GLang.generateTree(code, optimized))
}
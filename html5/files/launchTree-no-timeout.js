GLang.launchTree = function(preparedTree) {
    "use strict";
	GLang.evaluatePreparedTree(preparedTree, GLang.appEnvironment = GLang.RuntimeEnvironment(GLang.defaultRuntimeEnvironment));
};

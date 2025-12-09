GLang.launchTree = function(preparedTree) {
    "use strict";
    //Since variable scopes are implemented as objects,
    //we can create a new one with access to all outer variables using Object.create
	GLang.evaluatePreparedTree(preparedTree, Object.create(GLang.dr));
};

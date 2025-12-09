;(function(){

	function showMessageOnPage(message, type){
		try{
		var paragraph = document.createElement("p");
		paragraph.innerHTML = GLang.stringify(message);
		switch(type){
			case "error": paragraph.style.color = "red"; break;
			case "print": paragraph.style.color = "gray"; break;
		}
		document.getElementById("playground").appendChild(paragraph);
		}catch(e){}
	}

	GLang.error = function(error){
		if(GLANG_DEBUG) {
			console.error(error);
		}
		showMessageOnPage(error, "error")
	};
	GLang.print = function(data){
		if(GLANG_DEBUG) {
			console.warn(data);
		}
		showMessageOnPage(data, "print")
	};
	GLang.printValue = function(container){
		document.getElementById("playground").appendChild(GLang.displayValue(container));
	}

    GLang.elementTypeAvailable = true;
	
})();

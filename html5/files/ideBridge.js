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

	GLang.error = function(error){console.error(error); showMessageOnPage(error, "error")};
	GLang.log = function(data){console.log(data)};
	GLang.print = function(data){console.warn(data); showMessageOnPage(data, "print")};
	GLang.stringDisplay = function(stringProducer){
		return function(value){
			var paragraph = document.createElement("p");
			paragraph.appendChild(document.createTextNode(stringProducer(value)));
			return paragraph;
		}
	}
	GLang.printValue = function(container){
		console.log(container);
		document.getElementById("playground").appendChild(GLang.displayValue(container));
	}

	//Initialize package manager
	GLang.packageManager = GLang.domPackageManager;
	
})();
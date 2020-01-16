;(function(){

	function showMessageOnPage(message, type){
		try{
		var paragraph = document.createElement("p");
		paragraph.innerHTML = message + "";
		if(message instanceof Array || message.value){
			try{
				paragraph.innerHTML = JSON.stringify(message);
			}catch(err){
				try{
					paragraph.innerHTML = "{value:" + JSON.stringify(message.value) + "}";
				}catch(err){
					//JSON.stringify did not work, so we use the original value
				}
			}
		}
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
			paragraph.innerHTML = stringProducer(value);
			paragraph.style.width="100%";
			paragraph.style.display="inline-block";
			return paragraph;
		}
	}
	GLang.printValue = function(container){
		console.log(container);
		document.getElementById("playground").appendChild(GLang.displayValue(container));
	}

	//Initialize package manager
	GLang.packageManager = new GLang.DOMPackageManager();
	
})();
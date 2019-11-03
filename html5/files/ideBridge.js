;(function(global){

	function detectmob() { 
		if( navigator.userAgent.match(/Android/i)
			|| navigator.userAgent.match(/webOS/i)
			|| navigator.userAgent.match(/iPhone/i)
			|| navigator.userAgent.match(/iPad/i)
			|| navigator.userAgent.match(/iPod/i)
			|| navigator.userAgent.match(/BlackBerry/i)
			|| navigator.userAgent.match(/Windows Phone/i)
		){
			return true;
		} else {
			return false;
		}
	}

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
	GLang.log = function(data){console.log(data);};
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
		document.getElementById("playground").appendChild(GLang.displayValue(container));
	}
	GLang.useConsolePrint = function(){
		GLang.printValue = GLang.print;
		GLang.useConsolePrint = null;
	}

	//Initialize package manager
	GLang.packageManager = new GLang.DOMPackageManager();
	//GLang.packageManager.initialize(["packages/v1/browser_js.json", "packages/v1/general_js.json", "packages/v1/z.json"])
	
	if(window.location.search.substr(1).split("debug").length >= 2){
		//Enable debugging here
		alert("Debugging enabled & alerts working");
		setTimeout(function(){
			alert("Timeouts working")
			alert(document.getElementById("uiArea") ? "DOM access working" : "DOM access not working");
		}, 2000);
	}
	
})(this);
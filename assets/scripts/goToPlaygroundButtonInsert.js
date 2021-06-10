document.querySelectorAll("pre code.lang-kalzit").forEach(codeBlock => {
	console.log(codeBlock)
	
	var link = document.createElement("a");
	
	//Styling
	link.style.right = "0px";
	link.style.bottom = "0px";
	link.style.position = "absolute"; //Only works if the parent tag is "relative"
	link.innerText = "Try in Kalzit Playground";
	
	//Action
	link.href = "/app/ide?code=" + encodeURIComponent(codeBlock.textContent);
	
	codeBlock.append(document.createElement("br"))
	codeBlock.appendChild(link);
});
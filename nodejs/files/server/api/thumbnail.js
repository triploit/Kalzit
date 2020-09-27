var kUrl = require("./libraries/k-url");
var kFile = require("./libraries/k-file");
var kHttp = require("./libraries/k-http");

exports.act = function thumbnailAPI(kRequest) {
	var id = kRequest.url.match("[a-z\\-/]+[a-z0-9]+")[0];
	var session = kUrl.urlGetParameter("session", kRequest.url);
	
	var userToken = kFile.fileContent("./nogit/users/sessions/" + session + ".txt");
	var userTokenExists = null != userToken;
	
	if (userTokenExists) {
		var filesFolder = "./nogit/users/data/v3/" + userToken + "/files";
		
		var uploadName = filesFolder + "/" + id + ".thumbnail.png";
		if (kFile.fileIsFile(uploadName)) {
			kHttp.httpWriteStaticFile(kRequest, uploadName);
			kRequest.endServing();
		}
	}
};
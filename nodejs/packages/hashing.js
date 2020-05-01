this.mdFiveHash = function(string){
	return require("crypto").createHash("md5").update(string).digest("hex")
}
this.shaFiveTwelveHashWithSalt = function(string, salt){
	return require("crypto").createHmac("sha512", salt).update(string).digest("hex")
}
this.generateSalt = function(length){
	return require("crypto").randomBytes(length).toString('base64');
}
try {
    var fs = require("fs");
    var crypto = require("crypto");

    console.log("HI?");
    console.log(process.argv);

    var initVectorFile = process.argv[2];
    var key = process.argv[3];
    var kalzitFileFolder = process.argv[4];
        
    var filePath = kalzitFileFolder + "/encrypted";

    var readStream = fs.createReadStream(filePath);
    readStream = readStream.pipe(
	            crypto.createDecipheriv('aes-256-ctr', key, fs.readFileSync(initVectorFile))
	        );

    var res = fs.createWriteStream(kalzitFileFolder + "/raw");
    readStream.pipe(res);
    res.on('close', function() {
        servedStream.unpipe(this);
        //Ending chunked response for "filePath"
        res.end();
    });

    res.on("error", function(error) {
	    console.log(error);
    });

    console.log("Bye?");
} catch (error) {
    console.log(error);
}

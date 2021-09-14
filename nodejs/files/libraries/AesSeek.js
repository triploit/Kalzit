/*
License for this file:
The MIT License (MIT)

Copyright (c) 2014 James Newell, 2021 NetLamp

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
//Original source: https://github.com/jrnewell/crypto-aes-ctr/blob/master/lib/index.js
//Library for efficiently getting section of aes-256-ctr encrypted files

var crypto = require('crypto');
var streamTransform = require("./StreamSectionTransform");
var fs = require('fs');

var BLOCK_SIZE = 16;

function incrementBuffer(buf, cnt) {
  var i, len, mod;
  len = buf.length;
  i = len - 1;
  while (cnt !== 0) {
    mod = (cnt + buf[i]) % 256;
    cnt = Math.floor((cnt + buf[i]) / 256);
    buf[i] = mod;
    i -= 1;
    if (i < 0) {
      i = len - 1;
    }
  }
  return buf;
};

function createTransformStream(key, iv, counter) {
    if ("string" === (typeof iv)) {
      iv = new Buffer(iv, 'binary');
    }
    if (iv.length < BLOCK_SIZE) {
      throw new Error("IV buffer needs to be of length 16");
    }
    iv = incrementBuffer(iv, counter);

    // decrypt and encrypt are the same for aes-256-ctr
    return crypto.createDecipheriv('aes-256-ctr', key, iv);
}

/*
config is an object with the following properties:
* start: first wanted byte index
* end: last wanted byte index
* key: key for decryption
* initVector: iv for decryption (same as for encryption)
*/
function createReadStream(filePath, config) {
    //Figure out where to start decrypting
    var startBlock = Math.floor(config.start / BLOCK_SIZE);
    var startByte = startBlock * BLOCK_SIZE;
    //Figure out how many bytes to skip from there
    var skip = config.start - startByte;
    
    //Create the decrypted file stream, starting at the wanted block
    var decryptedReadStream = fs.createReadStream(filePath, {start: startByte})
        .pipe(createTransformStream(config.key, config.initVector, startBlock));
    
    //Cut off the start
    if (skip === 0) {
        return decryptedReadStream;
    }else{
        return decryptedReadStream.pipe(streamTransform.StreamCutTransform(skip));
    }
}

module.exports.createReadStream = createReadStream;
module.exports.createTransformStream = createTransformStream;

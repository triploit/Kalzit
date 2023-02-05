$userDataFolder = appParameter: "user-data-folder".

!folderContentAsync userDataFolder + "/data/v3" -> $userFolder fun {
    `TODO: Get decryption key`
    $keyFile = (first: userFolder) + "/decryption-key.txt".
    print: keyFile.
    
    !if (fileExists: keyFile) {
        print: "File is here: " + keyFile.
        !folderContentDeepAsync userFolder + "/files/v2/main" -> $potentialDecryptableFile fun {
            !if (fileIsFile: potentialDecryptableFile + "/encrypted") {
                print: "Can be decrypted: " + potentialDecryptableFile.
                
                `Gather data about the file`
                $ivFile = potentialDecryptableFile + "/iv".
                
                `Decrypt`
                print: "Decrypting started: " + potentialDecryptableFile.
                print: runCommandFromArray: "./cli";"command";"node";(print: fileRealpath: "./migrate/3-decryptSingleFile.js");(fileRealpath: potentialDecryptableFile);(fileRealpath: keyFile).
                print: "Decrypting done: " + potentialDecryptableFile.
            }
        }
    }
}

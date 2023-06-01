---
title: 'Files, files as events?'
description: Ballerina enhances file transfer with FTP listeners, reacting to events on servers. SFTP and FTPS options ensure security. Seamlessly integrate file transfer with Ballerina's secure functionality.
url: 'https://github.com/ballerina-platform/ballerina-distribution/blob/v2201.5.0/examples/ftp-service-send-file/ftp_service_send_file.bal'
---
```
listener ftp:Listener fileListener = check new ({
    host: "ftp.example.com",
    auth: {
        credentials: {
            username: "user1",
            password: "pass456"
        }
    },
    path: "/home/in",
    fileNamePattern: "(.*).txt"
});

service on fileListener {

    remote function onFileChange(ftp:WatchEvent & readonly event, ftp:Caller caller) 
            returns error? {
                
        foreach ftp:FileInfo addedFile in event.addedFiles {
            stream<io:Block, io:Error?> fileStream = check 
                            io:fileReadBlocksAsStream("./local/appendFile.txt", 7);
            check caller->append(addedFile.path, fileStream);
            check fileStream.close();
        }
    }
}
```
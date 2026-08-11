---
title: 'Files, files as events?'
description: Ballerina enhances file transfer with FTP listeners, reacting to events on servers. SFTP and FTPS options ensure security. Seamlessly integrate file transfer with Ballerina's secure functionality.
url: 'https://ballerina.io/learn/by-example/ftp-listener-file-changes/'
---
```
configurable string username = ?;
configurable string password = ?;

listener ftp:Listener fileListener = check new ({
    host: "ftp.example.com",
    auth: {
        credentials: {
            username,
            password
        }
    },
    pollingInterval: 30
});

@ftp:ServiceConfig {
    path: "/home/in",
    fileNamePattern: "(.*).txt"
}
service on fileListener {

    remote function onFileText(string content, ftp:FileInfo fileInfo, 
            ftp:Caller caller) returns error? {
        io:println("New file: ", fileInfo.name);
        io:println("Content: ", content);
        check caller->delete(fileInfo.path);
    }

    remote function onFileDelete(string deletedFile) {
        io:println("Deleted: ", deletedFile);
    }
}
```
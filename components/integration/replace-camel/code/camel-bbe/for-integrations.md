---
title: 'Language built for integrations'
description: 'Ballerina excels with its first-class services, listeners, and clients, making integration capabilities central to its design. Build scalable integrations effortlessly, thanks to its strong type system and native support for JSON and XML. Experience the simplicity and readability of Ballerina for seamless integration development.'
url: 'https://github.com/anupama-pathirage/ballerina-scenarios/tree/main/ballerina-zapier-samples/gdrive-new-event-to-slack-message'
---
```
service drive:DriveService on driveListener {

    remote function onFileCreate(drive:Change changeInfo) returns error? {
        slack:Message message = transform(changeInfo);
        _ = check slackClient->postMessage(message);
    }

    remote function onFolderCreate(drive:Change changeInfo) returns error? {
    }

    remote function onFileUpdate(drive:Change changeInfo) returns error? {
    }

    remote function onFolderUpdate(drive:Change changeInfo) returns error? {
    }

    remote function onDelete(drive:Change changeInfo) returns error? {
    }

    remote function onFileTrash(drive:Change changeInfo) returns error? {
    }

    remote function onFolderTrash(drive:Change changeInfo) returns error? {
    }
}
```
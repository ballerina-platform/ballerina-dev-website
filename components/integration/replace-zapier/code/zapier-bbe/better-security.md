---
title: 'Better security'
description: 'Ballerina provides robust security features such as encryption, authentication, and authorization, which are essential for businesses dealing with sensitive data.'
url: 'https://github.com/anupama-pathirage/ballerina-scenarios/tree/main/ballerina-zapier-samples/gdrive-new-event-to-slack-message'
---
```
import ballerinax/trigger.google.drive;
import ballerinax/slack;

// Configurability enables users to modify the system behavior through
// external user inputs in a secure way.
// Clients and services supports different authentication mechanisms.
configurable string slackToken = ?;
configurable string slackChannel = ?;
final slack:Client slackClient = check new ({auth: {token: slackToken}});

configurable drive:ListenerConfig driveListenerConfig = ?;
listener drive:Listener driveListener = new (driveListenerConfig);

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

function transform(drive:Change change) returns slack:Message => {
    channelName: slackChannel,
    text: string `New file ${change.file?.name ?: ""} added at ${change.time ?: ""} .`
};
```
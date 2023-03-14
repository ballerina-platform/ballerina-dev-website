---
title: 'Greater scalability, flexibility, and customization'
description: 'Ballerina is a flexible language that enables developers to create customized integrations and workflows to meet their specific needs. Its scalability and ability to handle complex workflows and large volumes of data make it ideal for businesses requiring automation solutions that can scale with their needs.'
url: 'https://github.com/anupama-pathirage/ballerina-scenarios/tree/main/ballerina-zapier-samples/github-new-issue-assigned-to-trello-card-and-twilio-sms'
---
```
final trello:Client trello = check new ({
    key: trelloApiKey,
    token: trelloApiToken
});

final twilio:Client twilio = check new ({
    twilioAuth: {
        accountSId: twilioAccountSid,
        authToken: twilioAuthToken
    }
});

service github:IssuesService on new github:Listener() {
    remote function onAssigned(github:IssuesEvent payload) returns error? {
        if payload.issue.assignee?.login != githubUser {
            return;
        }
        string message = string `Github new issue assigned!
        ${"\n"}Title: ${payload.issue.title}${"\n"}URL: ${payload.issue.html_url}${"\n"}`;
        _ = check twilio->sendSms(twilioFrom, twilioTo, message);
        
        trello:Cards card = transform(payload.issue.title, message);
        var _ = check trello->addCards(card);

    }
}

function transform(string title, string message) returns trello:Cards => {
    name: title,
    idList: trelloListId,
    desc: message
};
```
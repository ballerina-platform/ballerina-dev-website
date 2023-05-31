---
title: 'Greater scalability, flexibility, and customization'
description: Ballerina, being a language, provides greater flexibility to developers to create customized integrations and workflows to meet their specific needs. Its scalability and ability to handle complex integration scenarios and large volumes of data make it ideal for businesses requiring integration solutions that can scale with their needs.
url: 'https://github.com'
---
```
final trello:Client trello = check new ({
    key: trelloApiKey,
    token: trelloApiToken
});

final twilio:Client twilio = check new ({
    twilioAuth: {
        accountSId: twilioAccountSId,
        authToken: twilioAuthToken
    }
});

service github:IssuesService on new github:Listener() {
    remote function onAssigned(github:IssuesEvent payload) returns error? {
        github:Issue issue = payload.issue;
        if issue.assignee?.login != githubUser {
            return;
        }

        string title = issue.title;
        string message = string `Issue assigned.${"\n"
                                    }Title: ${title}${"\n"
                                    }URL: ${issue.html_url}${"\n"}`;
        _ = check twilio->sendSms(twilioFrom, twilioTo, message);
        
        trello:Cards card = transform(title, message);
        _ = check trello->addCards(card);
    }
}

function transform(string title, string message) returns trello:Cards => {
    name: title,
    idList: trelloListId,
    desc: message
};
```

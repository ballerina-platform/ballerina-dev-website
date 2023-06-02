---
title: 'Language built for integrations'
description: 'Ballerina excels with its first-class services, listeners, and clients, making integration capabilities central to its design. Build scalable integrations effortlessly, thanks to its strong type system and native support for JSON and XML. Experience the simplicity and readability of Ballerina for seamless integration development.'
url: 'https://github.com/xlight05/ballerina-scenarios/blob/main/blog_app/main.bal'
---
```
configurable string slackToken = ?;

type Blog record {
    string title;
    string content;
};

Blog[] blogs = [];

service /blog on new http:Listener(9090) {
    slack:Client slackClient;

    public function init() returns error? {
        slack:ConnectionConfig slackConfig = {
            auth: {
                token: slackToken
            }
        };
        self.slackClient = check new(slackConfig);
    }

    resource function get .() returns Blog[] {
        return blogs;
    }

    resource function post .(@http:Payload Blog blog) returns error? {
        future<error?> slackFuture = start self.notifySlack(blog);
        blogs.push(blog);
        check wait slackFuture;
    }

    function notifySlack(Blog blog) returns error? {
        slack:Message messageParams = {
            channelName: "ss",
            text: blog.title
        };
        _ = check self.slackClient->postMessage(messageParams);
    }
}
```
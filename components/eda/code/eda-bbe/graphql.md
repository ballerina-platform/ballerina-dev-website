---
title: 'GraphQL subscription'
description: Ballerina simplifies GraphQL subscriptions, allowing easy event streaming to frontend applications, enabling effortless event subscriptions and delivery to popular clients.
url: 'https://github.com/ballerina-platform/module-ballerina-graphql/tree/master/examples/news_alerts'
---
```
service /news on new graphql:Listener(9090) {

    remote function publish(NewsUpdate & readonly update) returns NewsRecord|error {
        lock {
            if publisherTable.hasKey(update.publisherId) {
                return produceNews(update).cloneReadOnly();
            }
        }
        return error("Invalid publisher");
    }

    resource function subscribe news(string userId, Agency agency) returns stream<News>|error {
        stream<News> newsStream;
        lock {
            if userTable.hasKey(userId) {
                NewsStream newsStreamGenerator = check new (userId, agency);
                newsStream = new (newsStreamGenerator);
            } else {
                return error("User not registered");
            }
        }
        return newsStream;
    }
}
```
---
title: "Out-of-the-box subscription support - No additional libraries are needed"
description: "Ballerina offers seamless support for GraphQL subscriptions out-of-the-box, eliminating the need for additional libraries like with Apollo. With Ballerina, you can effortlessly integrate systems like Apache Kafka into your GraphQL subscriptions, enhancing real-time data streaming capabilities. This simplifies development, reduces dependencies, and provides a comprehensive solution for building robust GraphQL subscription-based applications."
url: "https://github.com/ballerina-platform/module-ballerina-graphql/tree/master/examples/news_alerts"
---

```
service /news on new graphql:Listener(9090) {
    remote function publish(NewsUpdate & readonly update) returns NewsRecord|error {
        if publisherTable.hasKey(update.publisherId) {
            return produceNews(update).cloneReadOnly();
        }
        return error("Invalid publisher");
    }

    resource function subscribe news(string userId, Agency agency) returns stream<News>|error {
        stream<News> newsStream;
        if userTable.hasKey(userId) {
            NewsStream newsStreamGenerator = check new (userId, agency);
            newsStream = new (newsStreamGenerator);
            return newsStream;
        }
        return error("User not registered");
    }
}
```
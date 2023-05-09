---
title: 'Resilience engineering, built-in'
description: Ballerina’s built-in language and standard library features make programming in the failure-is-normal world of distributed systems as easy for every developer.
url: 'https://github.com/ballerina-guides/integration-samples/blob/main/gcalendar-new-event-to-trello-card/main.bal#L18'
---
```
http:RetryConfig retryConfig = {
    interval: 3,
    count: 3,
    backOffFactor: 2.0,
    maxWaitInterval: 20
};
final trello:Client trello = check new (apiKeyConfig, {retryConfig});

service calendar:CalendarService on calendarListener {
    remote function onNewEvent(calendar:Event payload) returns error? {
        // Mapping from Google Calendar Event to Trello Card
        trello:Cards card = transform(payload);

        // Add the card to the Trello list
        var _ = check trello->addCards(card);
    }

    remote function onEventDelete(calendar:Event payload) returns error? {
    }

    remote function onEventUpdate(calendar:Event payload) returns error? {
    }
}
```
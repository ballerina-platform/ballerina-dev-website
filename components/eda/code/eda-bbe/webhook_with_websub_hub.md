---
title: 'WebHooks with WebSub'
description: Ballerina combines HTTP and event-driven development leveraging the power of the HTTP ecosystem with WebSub for constructing event-driven applications effortlessly.
url: 'https://github.com/ballerina-platform/module-ballerina-websubhub/tree/main/examples/kafka-hub'
---
```
service /hub on new websubhub:Listener(9000) {

    remote function onRegisterTopic(readonly & websubhub:TopicRegistration message)
                returns websubhub:TopicRegistrationSuccess|websubhub:TopicRegistrationError {
        // Add your logic here
        return websubhub:TOPIC_REGISTRATION_SUCCESS;
    }

    remote function onDeregisterTopic(readonly & websubhub:TopicDeregistration message)
                returns websubhub:TopicDeregistrationSuccess|websubhub:TopicDeregistrationError {
        // Add your logic here
        return websubhub:TOPIC_DEREGISTRATION_SUCCESS;
    }

    remote function onUpdateMessage(readonly & websubhub:UpdateMessage message)
                returns websubhub:Acknowledgement|websubhub:UpdateMessageError {
        // Add your logic here
        return websubhub:ACKNOWLEDGEMENT;
    }

    remote function onSubscriptionValidation(readonly & websubhub:Subscription message)
                returns websubhub:SubscriptionDeniedError? {
        // Add your logic here
    }

    remote function onSubscriptionIntentVerified(readonly & websubhub:VerifiedSubscription message)
                returns error? {
        // Add your logic here
    }

    remote function onUnsubscriptionValidation(readonly & websubhub:Unsubscription message)
                returns websubhub:UnsubscriptionDeniedError? {
        // Add your logic here
    }

    remote function onUnsubscriptionIntentVerified(
                readonly & websubhub:VerifiedUnsubscription message) returns error? {
        // Add your logic here
    } 
}
```
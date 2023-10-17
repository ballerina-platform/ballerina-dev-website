---
title: 'Enhance sales responsiveness with Salesforce based notifications'
description: Sales related events need to be acted upon as soon as possible. For example, when a new lead is received, sales staff need to evaluate it and get in contact with the lead immediately. Ballerina can listen for any event in Salesforce and notify relevant employees over their preferred channels, ensuring that all customer events are attended in a timely manner.
---
```
import ballerina/log;
import ballerinax/trigger.salesforce;
import ballerinax/twilio;

type SalesforceListenerConfig record {|
    string username;
    string password;
|};

type TwilioClientConfig record {|
    string accountSId;
    string authToken;
|};

const string CHANNEL_NAME = "/data/ContactChangeEvent";

// Salesforce configuration parameters
configurable SalesforceListenerConfig salesforceListenerConfig = ?;

// Twilio configuration parameters
configurable TwilioClientConfig twilioClientConfig = ?;
configurable string fromNumber = ?;
configurable string toNumber = ?;

listener salesforce:Listener sfdcEventListener = new ({
    username: salesforceListenerConfig.username,
    password: salesforceListenerConfig.password,
    channelName: CHANNEL_NAME
});

final twilio:Client twilio = check new ({
    twilioAuth: {
        accountSId: twilioClientConfig.accountSId,
        authToken: twilioClientConfig.authToken
    }
});

service salesforce:RecordService on sfdcEventListener {
    isolated remote function onCreate(salesforce:EventData payload) returns error? {
        string firstName = "";
        string lastName = "";
        string[] nameParts = re `,`.split(payload.changedData["Name"].toString());
        if nameParts.length() >= 2 {
            firstName = re `=`.split(nameParts[0])[1];
            lastName = re `=`.split(re `\}`.replace(nameParts[1], ""))[1];
        } else {
            lastName = re `=`.split(re `\}`.replace(nameParts[0], ""))[1];
        }
        twilio:SmsResponse response = check twilio->sendSms(fromNumber, toNumber,
            string `New contact is created! | Name: ${firstName} ${lastName} | Created Date: 
            ${(check payload.changedData.CreatedDate).toString()}`);
        log:printInfo("SMS(SID: " + response.sid + ") sent successfully");
    }

    isolated remote function onUpdate(salesforce:EventData payload) returns error? {
        return;
    }

    isolated remote function onDelete(salesforce:EventData payload) returns error? {
        return;
    }

    isolated remote function onRestore(salesforce:EventData payload) returns error? {
        return;
    }
}
```

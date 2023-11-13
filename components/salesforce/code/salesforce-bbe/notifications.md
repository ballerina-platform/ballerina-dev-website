---
title: 'Act on Salesforce based notifications'
description: 'Sales related events need to be acted upon as soon as possible. For example, when a new lead is received, sales staff need to evaluate it and get in contact with the lead immediately. Ballerina can listen for any event in Salesforce and notify relevant employees over their preferred channels, ensuring that all customer events are attended in a timely manner.<br/><br/><i>Example: Send an SMS to a given number (via Twilio) when a new lead is created in Salesforce.</i>'
url: 'https://github.com/chathurace/integration-samples/blob/main/salesforce_api/sfdc-new-contact-to-twilio-sms/main.bal'
---
```
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
    }
}
```

---
title: 'Utilize AI to extract sales information'
description: "A Great amount of valuable sales-related information is captured in ad-hoc form such as emails, Word documents, and slides. Ballerina AI capabilities can be used to update Salesforce with information extracted from such unstructured data.<br/><br/><i>Example: Extract lead details such as name, phone number and company from emails using OpenAI, and create corresponding leads in Salesforce.</i>"
url: 'https://github.com/chathurace/integration-samples/blob/main/gmail-to-salesforce-lead/main.bal'
---
```
gmail:Client gmail = check new ({auth: {token: gmailAccessToken}});
chat:Client openAiChat = check new ({auth: {token: openAIKey}});
sf:Client salesforce = check new ({baseUrl: salesforceBaseUrl, auth: {token: salesforceAccessToken}});

public function main() returns error? {
    gmail:LabelList labelList = check gmail->listLabels("me");
    string[] labelIdsToMatch = from gmail:Label {name, id} in labelList.labels
        where ["Lead"].indexOf(name) != ()
        select id;
    gmail:MsgSearchFilter searchFilter = {
        includeSpamTrash: false,
        labelIds: labelIdsToMatch
    };
    gmail:MailThread[] matchingMailThreads = check from gmail:MailThread mailThread
        in check gmail->listThreads(filter = searchFilter)
        select mailThread;
    foreach gmail:MailThread mailThread in matchingMailThreads {
        _ = check gmail->modifyThread(mailThread.id, [], labelIdsToMatch);
    }
    gmail:Message[] matchingEmails = [];
    foreach gmail:MailThread mailThread in matchingMailThreads {
        gmail:MailThread response = check gmail->readThread(mailThread.id);
        matchingEmails.push((<gmail:Message[]>response.messages)[0]);
    }
    Email[] emails = from gmail:Message message in matchingEmails
        let Email|error email = parseEmail(message)
        where email is Email
        select email;
    Lead[] leads = from Email email in emails
        let Lead? lead = check generateLead(email, openAiChat)
        where lead is Lead
        select lead;
    from Lead lead in leads
    do {
        _ = check salesforce->create("EmailLead__c", lead);
    };
}
```

---
title: 'Utilize AI to extract sales information'
description: A Great amount of valuable sales-related information is captured in ad-hoc form such as emails, Word documents, and slides. Ballerina AI capabilities can be used to update Salesforce with information extracted from such unstructured data.
---
```
import ballerina/lang.runtime;
import ballerina/log;
import ballerina/mime;
import ballerinax/googleapis.gmail;
import ballerinax/openai.chat;
import ballerinax/salesforce as sf;

configurable string gmailAccessToken = ?;
configurable string openAIKey = ?;
configurable string salesforceBaseUrl = ?;
configurable string salesforceAccessToken = ?;

const LABEL = "Lead";
final gmail:Client gmail = check new ({auth: {token: gmailAccessToken}});
final chat:Client openAiChat = check new ({auth: {token: openAIKey}});
final sf:Client salesforce = check new ({baseUrl: salesforceBaseUrl, auth: {token: salesforceAccessToken}});

public function main() returns error? {
    Email[] emails = check getEmails(LABEL);
    Lead[] leads = from Email email in emails
        let Lead? lead = generateLead(email)
        where lead is Lead
        select lead;
    addLeadsToSalesforce(leads);
}

function getEmails(string label) returns Email[]|error {
    string[] labelIdsToMatch = check getLabelIds(gmail, [label]);
    if labelIdsToMatch.length() == 0 {
        return error("Unable to find any labels to match.");
    }

    gmail:MailThread[] matchingMailThreads = check getMatchingMailThreads(gmail, labelIdsToMatch);
    removeLabels(gmail, matchingMailThreads, labelIdsToMatch);
    gmail:Message[] matchingEmails = getMatchingEmails(gmail, matchingMailThreads);

    return from gmail:Message message in matchingEmails
        let Email|error email = parseEmail(message)
        where email is Email
        select email;
}

function getLabelIds(gmail:Client gmail, string[] labelsToMatch) returns string[]|error {
    gmail:LabelList labelList = check gmail->listLabels("me");
    return from gmail:Label {name, id} in labelList.labels
        where labelsToMatch.indexOf(name) != ()
        select id;
}

function getMatchingMailThreads(gmail:Client gmail, string[] labelIdsToMatch) returns gmail:MailThread[]|error {
    gmail:MsgSearchFilter searchFilter = {
        includeSpamTrash: false,
        labelIds: labelIdsToMatch
    };

    return from gmail:MailThread mailThread in check gmail->listThreads(filter = searchFilter)
        select mailThread;
}

function removeLabels(gmail:Client gmail, gmail:MailThread[] mailThreads, string[] labelIds) {
    foreach gmail:MailThread mailThread in mailThreads {
        gmail:MailThread|error removeLabelResponse = gmail->modifyThread(mailThread.id, [], labelIds);
        if removeLabelResponse is error {
            log:printError("An error occured in removing the labels from the thread.",
                removeLabelResponse, removeLabelResponse.stackTrace(), threadId = mailThread.id, labelIds = labelIds);
        }
    }
}

function getMatchingEmails(gmail:Client gmail, gmail:MailThread[] mailThreads) returns gmail:Message[] {
    gmail:Message[] messages = [];

    foreach gmail:MailThread mailThread in mailThreads {
        gmail:MailThread|error response = gmail->readThread(mailThread.id);
        if response is error {
            log:printError("An error occured while reading the email.",
                response, response.stackTrace(), threadId = mailThread.id);
            continue;
        }

        if !(response.messages is gmail:Message[]) || (<gmail:Message[]>response.messages).length() < 1 {
            log:printError("Unable to find any messages in the thread.", threadId = mailThread.id);
            continue;
        }

        messages.push((<gmail:Message[]>response.messages)[0]);
    }

    return messages;
}

function parseEmail(gmail:Message message) returns Email|error {
    do {
        gmail:MessageBodyPart bodyPart = check message.emailBodyInText.ensureType(gmail:MessageBodyPart);
        string bodyPartText = check bodyPart.data.ensureType(string);
        string body = check mime:base64Decode(bodyPartText).ensureType(string);

        return {
            'from: check message.headerFrom.ensureType(string),
            subject: check message.headerSubject.ensureType(string),
            body: body
        };
    } on fail error e {
        log:printError("An error occured while parsing the email.", e, e.stackTrace(), message = message);
        return e;
    }
}

function generateLead(Email email) returns Lead? {
    chat:CreateChatCompletionRequest request = {
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "user",
                content: string `
            Extract the following details in JSON from the email.
                {
                    firstName__c: string, // Mandatory
                    lastName__c: string, // Mandatory
                    email__c: string // Mandatory
                    phoneNumber__c: string, // With country code. Use N/A if unable to find
                    company__c: string, // Mandatory
                    designation__c: string // Not mandatory. Use N/A if unable to find
                }

            Here is the email:    
            {
                from: ${email.'from},
                subject: ${email.subject},
                body: ${email.body}
            }
        `
            }
        ]
    };

    do {
        chat:CreateChatCompletionResponse response = check openAiChat->/chat/completions.post(request);
        if response.choices.length() < 1 {
            check error("Unable to find any choices in the response.");
        }
        string content = check response.choices[0].message?.content.ensureType(string);
        return check content.fromJsonStringWithType(Lead);
    } on fail error e {
        log:printError("An error occured while generating the lead.", e, e.stackTrace(), email = email);
        return;
    }
}

function addLeadsToSalesforce(Lead[] leads) {
    from Lead lead in leads
    do {
        sf:CreationResponse|error createResponse = salesforce->create("EmailLead__c", lead);
        if createResponse is error {
            log:printError("An error occured while creating a Lead object on salesforce.",
                createResponse, createResponse.stackTrace(), lead = lead);
        } else {
            log:printInfo("Lead successfully created.", lead = lead);
        }
    };
}
```

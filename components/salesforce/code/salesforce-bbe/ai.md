---
title: 'Utilize AI to extract sales information'
description: "A Great amount of valuable sales-related information is captured in ad-hoc forms, such as emails, Word documents, and slides. Ballerina AI capabilities can be used to update Salesforce with information extracted from such unstructured data.<br/><br/><i>Example: Extract lead details such as name, phone number and company from emails using OpenAI, and create corresponding leads in Salesforce.</i>"
url: 'https://github.com/ballerina-guides/integration-samples/blob/main/gmail-to-salesforce-lead'
---
```
public function main() returns error? {
    gmail:LabelList labelList = check gmail->listLabels("me");
    Email[] emails = check getMatchingEmails(labelList);
    foreach Email email in emails {
        chat:CreateChatCompletionRequest request = {
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "user",
                    content: string `Extract the following details in JSON from the email.
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
                    }`
                }
            ]
        };
        chat:CreateChatCompletionResponse response = check openAiChat->/chat/completions.post(request);
        if response.choices.length() < 1 {
            return error("Unable to find any choices in the response.");
        }
        string content = check response.choices[0].message?.content.ensureType(string);
        _ = check salesforce->create("EmailLead__c", check content.fromJsonStringWithType(Lead));
    }
}
```

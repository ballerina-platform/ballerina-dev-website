---
title: 'Connect Salesforce with productivity tools'
description: "Sales and customer data are often captured via office productivity tools such as Google Docs, Sheets, and Slack. Ballerina can pump data from such office tools into Salesforce by performing validation and cleansing where necessary to standardize manually entered data.<br/><br/><i>Example: Create contacts in Salesforce by reading contact details given in a Google Sheet.</i>"
url: 'https://github.com/chathurace/integration-samples/blob/main/salesforce_api/gsheet-new-row-to-sfdc-new-contact/main.bal'
---
```
sheets:Client sheets = check new ({auth: {token: sheetsAccessToken}});

salesforce:Client salesforce = check new ({
    baseUrl: salesforceBaseUrl,
    auth: {
        token: salesforceAccessToken
    }
});

public function main() returns error? {
    sheets:Range range = check sheets->getRange(spreadsheetId, worksheetName, "A1:G");
    (int|string|decimal)[] headers = range.values[0];
    foreach (int|string|decimal)[] item in range.values.slice(1) {
        int? indexOfEmail = headers.indexOf("Email");
        if indexOfEmail is int {
            stream<Contact, error?> retrievedStream = check salesforce->query(
                string `SELECT Id, Email FROM Contact WHERE Email='${item[indexOfEmail]}'`);
            if retrievedStream.next() is () {
                record {} newContact = map from int index in 0 ..< headers.length()
                    let int|string|decimal header = headers[index]
                    select [header.toString(), item[index]];
                _ = check salesforce->create("Contact", newContact);
            }
        }
    }
}
```

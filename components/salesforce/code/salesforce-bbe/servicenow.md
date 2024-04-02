---
title: 'Make sales staff aware of customer issues'
description: "Customer issues are tracked in support systems such as JIRA or ServiceNow. However, sales staff also need to be informed about the problems faced by their customers. This synchronization can be done with Ballerina using a few simple steps.<br/><br/><i>Example: Import support cases from ServiceNow to Salesforce for a given time period.</i>"
url: 'https://github.com/ballerina-guides/integration-samples/blob/main/servicenow-case-to-salesforce-case'
---
```
public function main() returns error? {
    DateRange fetchPeriod = check calculateFetchingPeriod();
    CaseData[] cases = check  fetchCasesFromServiceNow(fetchPeriod.'start, fetchPeriod.end);
    foreach CaseData caseData in cases {
        stream<Id, error?> customerStream = check salesforce->query(
            string `SELECT Id FROM Account WHERE Name = '${caseData.account.name}'`);
        record {|Id value;|}? existingCustomer = check customerStream.next();
        check customerStream.close();
        if existingCustomer is () {
            continue;
        }
        SalesforceCase salesforceCase = {
            Name: caseData.number,
            Created_on__c: caseData.sys_created_on,
            Priority__c: caseData.priority,
            Account__c: existingCustomer.value.Id,
            Summary__c: caseData.case
        };
        _ = check salesforce->create("Support_Case__c", salesforceCase);
    }
    check io:fileWriteString(syncData, check time:civilToString(fetchPeriod.now));
}

```
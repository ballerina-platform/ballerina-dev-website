---
title: 'Make sales staff aware of customer issues'
description: 'Ballerina can simplify the synchronization of customer issues tracked in support systems like JIRA or ServiceNow with sales staff, ensuring seamless communication through a few simple steps.<br/><br/><i>Example: Import support cases from ServiceNow to Salesforce for a given time period.</i>'
url: 'https://github.com/chathurace/integration-samples/blob/main/servicenow-case-to-salesforce-case/main.bal'
---
```
sf:Client salesforce = check new (salesforceConfig);

public function main() returns error? {
    DateRange fetchPeriod = check calculateFetchingPeriod();
    string query = string `sys_created_onBETWEENjavascript:gs.dateGenerate(${fetchPeriod.'start})
        @javascript:gs.dateGenerate(${fetchPeriod.end})`;
    http:Client servicenow = check new (string `https://${servicenowInstance}.service-now.com/api/sn_customerservice`);
    string serviceNowCredentials = check mime:base64Encode(serviceNowUsername + ":" + serviceNowPassword, "UTF-8").ensureType();
    record {CaseData[] result;} caseResponse = check servicenow->/case(
        headers = {"Authorization": "Basic " + serviceNowCredentials},
        sysparm_query = check url:encode(query, "UTF-8")
    );
    CaseData[] cases = caseResponse.result;
    check io:fileWriteString(syncData, check time:civilToString(fetchPeriod.now));
    foreach CaseData caseData in cases {
        stream<Id, error?> customerQuery = check salesforce->query(
            string `SELECT Id FROM Account WHERE Name = '${caseData.account.name}'`);
        record {|Id value;|}? existingCustomer = check customerQuery.next();
        check customerQuery.close();
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
}

```
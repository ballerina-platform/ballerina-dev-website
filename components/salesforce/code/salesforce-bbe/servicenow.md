---
title: 'Make sales staff aware of customer issues'
description: Customer issues are tracked in support systems such as JIRA or ServiceNow. However, sales staff also need to be informed about the issues faced by their customers. This synchronization can be done with Ballerina using a few simple steps.
url: 'https://github.com/chathurace/integration-samples/blob/main/servicenow-case-to-salesforce-case/main.bal'
---
```
import ballerina/http;
import ballerina/io;
import ballerina/log;
import ballerina/mime;
import ballerina/time;
import ballerina/url;
import ballerinax/salesforce as sf;

configurable string servicenowInstance = ?;
configurable string syncData = ?;
configurable string serviceNowUsername = ?;
configurable string serviceNowPassword = ?;
configurable sf:ConnectionConfig salesforceConfig = ?;

public function main() returns error? {
    DateRange|error fetchPeriod = calculateFetchingPeriod();
    if fetchPeriod is error {
        log:printError("Error while calculating fetching period: ", fetchPeriod);
        return;
    }

    CaseData[]|error cases = fetchCasesFromServiceNow(fetchPeriod.'start, fetchPeriod.end);
    if cases is error {
        log:printError("Error while fetching cases from ServiceNow: ", cases);
        return;
    }

    error? e = addCasesToSalesforce(cases);
    if e is error {
        log:printError("Error while adding cases to Salesforce: ", e);
        return;
    }

    check io:fileWriteString(syncData, check time:civilToString(fetchPeriod.now));
    log:printInfo("Updated salesforce with cases from servicenow." +
        " Cases added: " + cases.length().toString() +
        " Update Timestamp: " + check time:civilToString(fetchPeriod.now));
}

function calculateFetchingPeriod() returns DateRange|error {
    string lastFetchString = check io:fileReadString(syncData);
    time:Civil lastFetch = check time:civilFromString(lastFetchString);
    string 'start = string `'${lastFetch.year}-${lastFetch.month}-${lastFetch.day}','${lastFetch.hour}:${lastFetch.minute}:00'`;
    time:Civil now = time:utcToCivil(time:utcNow());
    string end = string `'${now.year}-${now.month}-${now.day}','${now.hour}:${now.minute}:00'`;
    return {'start, end, now};
}

function fetchCasesFromServiceNow(string fetchFrom, string fetchTill) returns CaseData[]|error {
    string query = string `sys_created_onBETWEENjavascript:gs.dateGenerate(${fetchFrom})@javascript:gs.dateGenerate(${fetchTill})`;
    http:Client servicenow = check new (string `https://${servicenowInstance}.service-now.com/api/sn_customerservice`);
    string serviceNowCredentials = check mime:base64Encode(serviceNowUsername + ":" + serviceNowPassword, "UTF-8").ensureType();
    record {CaseData[] result;} caseResponse = check servicenow->/case(
        headers = {"Authorization": "Basic " + serviceNowCredentials},
        sysparm_query = check url:encode(query, "UTF-8")
    );
    return caseResponse.result;
}

function addCasesToSalesforce(CaseData[] cases) returns error? {
    sf:Client salesforce = check new (salesforceConfig);
    foreach CaseData caseData in cases {
        stream<Id, error?> customerQuery = check salesforce->query(
            string `SELECT Id FROM Account WHERE Name = '${caseData.account.name}'`);
        record {|Id value;|}? existingCustomer = check customerQuery.next();
        check customerQuery.close();
        if existingCustomer is () {
            log:printInfo("Customer not found in Salesforce: " + caseData.account.name);
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
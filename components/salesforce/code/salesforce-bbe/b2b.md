---
title: "Integrate Salesforce with EDI-Based B2B Channels"
description: Interactions between businesses, such as sending purchase orders and invoices, usually occur over EDI-based B2B channels. Built-in EDI capabilities of Ballerina can directly integrate B2B channels with Salesforce. For example, it is possible to update Opportunities in Salesforce based on the exchange of EDI 840, 843, and 850 messages.
url: 'https://github.com/chathurace/integration-samples/blob/main/ftp-edi-message-to-salesforce-opportunity/main.bal'
---
```
import ballerina/file;
import ballerina/ftp;
import ballerina/io;
import ballerina/log;

import ballerinax/edifact.d03a.retail.mREQOTE;
import ballerinax/salesforce as sf;

configurable ftp:ClientConfiguration ftpConfig = ?;
configurable string ftpNewQuotesPath = ?;
configurable string ftpProcessedQuotesPath = ?;
configurable sf:ConnectionConfig salesforceConfig = ?;
configurable string salesforcePriceBookId = ?;

ftp:Client fileServer = check new ftp:Client(ftpConfig);
sf:Client salesforce = check new (salesforceConfig);

public function main() returns error? {
    ftp:FileInfo[] quoteList = check fileServer->list(ftpNewQuotesPath);
    foreach ftp:FileInfo quoteFile in quoteList {
        string|error quoteText = getFileText(quoteFile);
        if quoteText is error {
            log:printError(quoteText.message());
            continue;
        }
        mREQOTE:EDI_REQOTE_Request_for_quote_message quote = check mREQOTE:fromEdiString(quoteText);
        QuoteRequest quoteRequest = check transformQuoteRequest(quote);
        string|error accountId = getSalesforceAccountId(quoteRequest.accountName);
        if accountId is error {
            log:printError(accountId.message());
            continue;
        }
        string oppId = check getSalesforceOpportunityId(accountId, quoteRequest.oppName);
        check createLineItems(quoteRequest.itemData, oppId);
        check moveProcessedFile(quoteFile, quoteText);
    }
}

function getSalesforceAccountId(string accountName) returns string|error {
    stream<Id, error?> accQuery = check salesforce->query(
            string `SELECT Id FROM Account WHERE Name = '${accountName}'`);
    record {|Id value;|}? account = check accQuery.next();
    check accQuery.close();
    if account is () {
        return error("Account not found. Account name: " + accountName);
    }
    return account.value.Id;
}

function getSalesforceOpportunityId(string accountId, string oppName) returns string|error {
    stream<Id, error?> oppQuery = check salesforce->query(
            string `SELECT Id FROM Opportunity WHERE Name = '${oppName}'`);
    record {|Id value;|}? existingOpp = check oppQuery.next();
    check oppQuery.close();
    if existingOpp !is () {
        return existingOpp.value.Id;
    }
    Opportunity opp = {
        Name: oppName,
        AccountId: accountId,
        Pricebook2Id: salesforcePriceBookId
    };
    sf:CreationResponse oppResult = check salesforce->create("Opportunity", opp);
    return oppResult.id;
}

function createLineItems(ItemData[] items, string oppId) returns error? {
    foreach ItemData item in items {
        stream<PriceBookEntry, error?> query = check salesforce->query(string `SELECT UnitPrice FROM PricebookEntry WHERE Pricebook2Id = '01s6C000000UN4PQAW' AND Product2Id = '${item.itemId}'`);
        record {|PriceBookEntry value;|}? unionResult = check query.next();
        check query.close();
        if unionResult is () {
            return error(string `Pricebook entry not found. Opportunity: ${oppId}, Item ID: ${item.itemId}`);
        }
        OpportunityProduct oppProduct = {
            OpportunityId: oppId,
            Product2Id: item.itemId,
            Quantity: item.quantity,
            UnitPrice: unionResult.value.UnitPrice
        };
        _ = check salesforce->create("OpportunityLineItem", oppProduct);
    }
}

function moveProcessedFile(ftp:FileInfo quoteFile, string quoteText) returns error? {
    check fileServer->put(check file:joinPath(ftpProcessedQuotesPath, quoteFile.name), quoteText.toBytes());
    check fileServer->delete(quoteFile.path);
}

function getFileText(ftp:FileInfo quoteFile) returns string|error {
    if !quoteFile.name.endsWith(".edi") {
        return error("Invalid file type. File name: " + quoteFile.name);
    }
    stream<byte[] & readonly, io:Error?> fileStream = check fileServer->get(quoteFile.path);
    byte[] content = [];
    check fileStream.forEach(function(byte[] & readonly chunk) {
        content.push(...chunk);
    });
    return string:fromBytes(content);
}
```

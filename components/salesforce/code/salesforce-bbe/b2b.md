---
title: "Integrate Salesforce with B2B Channels"
description: "Interactions between businesses, such as sending purchase orders and invoices, usually occur over EDI-based B2B channels. Ballerina's built-in EDI capabilities can directly integrate B2B channels with Salesforce and update sales data based on B2B transactions.<br/><br/><i>Example: Update products associated with Salesforce opportunities based on products listed in EDIFACT Request for Quotation (REQOTE) messages.</i>"
url: 'https://github.com/ballerina-guides/integration-samples/blob/main/ftp-edi-message-to-salesforce-opportunity'
---
```
public function main() returns error? {
    ftp:FileInfo[] quoteList = check fileServer->list(ftpNewQuotesPath);
    foreach ftp:FileInfo quoteFile in quoteList {
        stream<byte[] & readonly, io:Error?> fileStream = check fileServer->get(quoteFile.path);
        string quoteText = check streamToString(fileStream);
        mREQOTE:EDI_REQOTE_Request_for_quote_message quote = check mREQOTE:fromEdiString(quoteText);
        QuoteRequest quoteRequest = check transformQuoteRequest(quote);
        stream<Id, error?> accQuery = check salesforce->query(
            string `SELECT Id FROM Account WHERE Name = '${quoteRequest.accountName}'`
        );
        record {|Id value;|}? account = check accQuery.next();
        check accQuery.close();
        if account is () {
            return error("Account not found. Account name: " + quoteRequest.accountName);
        }
        Opportunity opp = {
            Name: quoteRequest.oppName,
            AccountId: account.value.Id,
            Pricebook2Id: salesforcePriceBookId
        };
        string oppId = check getOpportunityId(salesforce, quoteRequest, opp);
        check createOpportunityLineItems(quoteRequest, oppId);
    }
}
```

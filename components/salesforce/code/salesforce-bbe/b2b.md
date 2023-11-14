---
title: "Integrate Salesforce with B2B Channels"
description: "Ballerina's built-in EDI capabilities seamlessly integrate B2B channels with Salesforce, enabling direct updating of sales data from transactions like purchase orders and invoices.<br/><br/><i>Example: Update products associated with Salesforce opportunities based on products listed in EDIFACT Request for Quotation (REQOTE) messages.</i>"
url: 'https://github.com/chathurace/integration-samples/blob/main/ftp-edi-message-to-salesforce-opportunity/main.bal'
---
```
sf:Client salesforce = check new (salesforceConfig);
ftp:Client fileServer = check new ftp:Client(ftpConfig);

public function main() returns error? {

    // Get new quotes from the FTP new quotes directory, and iterate through them.
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

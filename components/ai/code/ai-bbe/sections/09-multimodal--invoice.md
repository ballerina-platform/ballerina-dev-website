---
lang: ballerina
---
```
import ballerina/ai;
import ballerina/constraint;
import ballerina/http;
import ballerinax/ai.anthropic;

configurable string anthropicApiKey = ?;
configurable string accountsPayableUrl = "http://localhost:9091";

// Anthropic: accepts PDF input as an ai:FileDocument (bytes need a mimeType).
final ai:ModelProvider claude = check new anthropic:ModelProvider(anthropicApiKey, anthropic:CLAUDE_SONNET_4_5);
final http:Client accountsPayable = check new (accountsPayableUrl);

# Fields extracted from a supplier invoice.
type Invoice record {|
    # The supplier's invoice number
    @constraint:String {minLength: 1}
    string invoiceNumber;
    # The purchase order number printed on the invoice, if any
    string purchaseOrder?;
    # ISO 4217 currency code, for example USD
    @constraint:String {pattern: re `[A-Z]{3}`}
    string currency;
    # The total amount payable, including tax
    @constraint:Number {minValue: 0}
    decimal total;
|};

isolated function processInvoice(byte[] pdf) returns Invoice|error {
    ai:FileDocument invoicePdf = {content: pdf, metadata: {mimeType: "application/pdf"}};
    Invoice extracted = check claude->generate(`Extract the invoice fields from this supplier invoice: ${invoicePdf}`);
    Invoice invoice = check constraint:validate(extracted);   // shape and ranges, not facts
    if invoice.purchaseOrder is () {
        return error(string `Invoice ${invoice.invoiceNumber} has no PO number; send it for manual review`);
    }
    http:Response _ = check accountsPayable->/invoices.post(invoice); // downstream system re-checks against the PO
    return invoice;
}
```

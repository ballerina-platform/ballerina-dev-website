---
lang: text
---
```
Illustrative values (no live model call was made for this example)

processInvoice(INV-20931.pdf)
  claude->generate  -> Invoice
    {"invoiceNumber":"INV-20931", "purchaseOrder":"PO-7781", "currency":"USD", "total":1284.50}
  constraint:validate -> ok
  POST /invoices (accounts payable) -> 201 Created; AP matches it against PO-7781

Scanned invoice without a PO number
  {"invoiceNumber":"INV-20944", "currency":"USD", "total":312.00}
  error: Invoice INV-20944 has no PO number; send it for manual review

Model returns "usd" as the currency            (validation output captured locally)
  constraint:validate -> error: Validation failed for '$.currency:pattern' constraint(s).

A response that fails validation never reaches the accounts payable system. A response
that passes validation can still be wrong, for example a misread total, which is why
the downstream system checks it against the purchase order.
```

---
title: 'EDIFACT? Ballerina is EDIFACT'
description: With Ballerina's built-in support for EDIFACT, organizations can easily handle EDIFACT messages, process complex data structures, and exchange information with partner networks. By leveraging Ballerina's intuitive features, developers can streamline EDIFACT integration, ensuring smooth communication with trading partners.
url: 'https://github.com/ballerina-guides/b2b-samples/blob/main/ballerina-edifact/main.bal'
---
```
import ballerina/io;
import ballerinax/edifact.finance.d96a.mINVOIC;

public function main() returns error? {
    string ediText = check io:fileReadString("resources/invoice_message_in.edi");
    mINVOIC:EDI_INVOIC_Invoice_message invoice = check mINVOIC:fromEdiString(ediText);
    string? paymentMethod = 
            invoice?.PAYMENT_INSTRUCTIONS?.PAYMENT_INSTRUCTION_DETAILS?.Payment_means;
    if paymentMethod != "42" {
        return;
    }
    foreach mINVOIC:Segment_group_15_GType allowance in invoice.Segment_group_15 {
        if allowance.ALLOWANCE_OR_CHARGE.Allowance_or_charge_qualifier != "A" ||
            allowance.ALLOWANCE_OR_CHARGE.Settlement != "6" {
                continue;
        }
        mINVOIC:Segment_group_19_GType[] amounts = allowance.Segment_group_19;
        foreach mINVOIC:Segment_group_19_GType amount in amounts {
            string? sAmount = amount.MONETARY_AMOUNT_2.MONETARY_AMOUNT_1.Monetary_amount;
            if sAmount is string {
                decimal dAmount = check decimal:fromString(sAmount);
                dAmount += dAmount * <decimal>.1;
                amount.MONETARY_AMOUNT_2.MONETARY_AMOUNT_1.Monetary_amount = dAmount.toString();
            }
        }
    }
    io:println(invoice.toJson());
}
```
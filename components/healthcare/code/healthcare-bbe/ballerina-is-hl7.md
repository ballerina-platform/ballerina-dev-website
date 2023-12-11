---
title: 'HL7?  Ballerina is HL7'
description: Ballerina offers built-in support for the HL7 messaging standard, which is still the most commonly used standard in the healthcare industry to facilitate the exchange of information between different systems. With Ballerina, parsing HL7 messages is a breeze, simplifying the processing and exchange of healthcare data.
url: 'https://github.com/ballerina-guides/healthcare-samples/blob/main/working-with-hl7/working_with_hl7_parsing.bal'
---
```
// The following example is a simple serialized HL v2.3 ADT A01 message.
final string msg = "MSH|^~\\&|ADT1|GOOD HEALTH HOSPITAL|GHH LAB, INC.|GOOD HEALTH HOSPITAL|" +
"198808181126|SECURITY|ADT^A01^ADT_A01|MSG00001|P|2.3||\rEVN|A01|200708181123||" +
"\rPID|1||PATID1234^5^M11^ADT1^MR^GOOD HEALTH HOSPITAL~123456789^^^USSSA^SS||" +
"BATMAN^ADAM^A^III||19610615|M||C|2222 HOME STREET^^GREENSBORO^NC^27401-1020|GL|" +
"(555) 555-2004|(555)555-2004||S||PATID12345001^2^M10^ADT1^AN^A|444333333|987654^NC|" +
"\rNK1|1|NUCLEAR^NELDA^W|SPO^SPOUSE||||NK^NEXT OF KIN$\rPV1|1|I|2000^2012^01||||" +
"004777^ATTEND^AARON^A|||SUR||||ADM|A0|";

public function main() returns error? {
    // This message, ADT^A01 is an HL7 data type consisting of several components, so we
    // will cast it as such. The ADT_A01 class extends from Message, providing specialized
    // accessors for ADT^A01's segments.
    //  
    // Ballerina HL7 provides several versions of the ADT_A01 record type, each in a
    // different package (note the import statement above) corresponding to the HL7
    // version for the message.
    hl7v23:ADT_A01 adtMsg = check hl7:parse(msg).ensureType(hl7v23:ADT_A01);
    hl7v23:XPN[] patientName = adtMsg.pid.pid5;
    io:println("Family Name: ", patientName[0].xpn1);
}
```
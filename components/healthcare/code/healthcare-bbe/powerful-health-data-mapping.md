---
title: 'Powerful health data mapping'
description: Ballerina makes data mapping seamless through its pre-built HL7v2.x to FHIR transformation functionalities, making short work of healthcare data mapping tasks. Ballerina has cracked the challenge of mapping one kind of data value to another kind of data value, simultaneously as code and picture, so that both are simple, powerful, and boundless.
image: 'images/health-data-mapping.png'
url: 'https://github.com/ballerina-guides/healthcare-samples/blob/main/hl7v2-to-fhir/main.bal'
---
```
final string msg =
"MSH|^~\\&|ADT1|GOOD HEALTH HOSPITAL|GHH LAB, INC.|GOOD HEALTH" +
"HOSPITAL|198808181126|SECURITY|ADT^A01^ADT_A01|MSG00001|P|2.3||\rEVN|A01|" +
"200708181123||\rPID|1||PATID1234^5^M11^ADT1^MR^GOOD HEALTH HOSPITAL~123456789^^^USSSA^SS||" +
"BATMAN^ADAM^A^III||19610615|M||C|2222 HOME STREET^^GREENSBORO^NC^27401-1020|GL|" +
"(555)555-2004|(555)555-2004||S||PATID12345001^2^M10^ADT1^AN^A|444333333|987654^NC|" +
"\rNK1|1|NUCLEAR^NELDA^W|SPO^SPOUSE||||NK^NEXT OF KIN$\rPV1|1|I|2000^2012^01||||" +
"004777^ATTEND^AARON^A|||SUR||||ADM|A0|";

public function main() returns error? {
    // Transform HL7v2 message to FHIR R4.
    // You can pass a HL7v2 message and get a FHIR R4 Bundle based on
    // the mappings defined at
    // https://build.fhir.org/ig/HL7/v2-to-fhir/branches/master/datatype_maps.html.
    json v2tofhirResult = check v2tofhirr4:v2ToFhir(msg);
    io:println("Transformed FHIR message: ", v2tofhirResult.toString());

    // v2tofhirr4 library exposes these low level functions as well,
    // In this case, by using stringToHl7 function you can pass a HL7v2 message string and get a parsed HL7v2 message model.
    hl7:Message hl7msg = check v2tofhirr4:stringToHl7(msg);
    if (hl7msg is hl7v23:ADT_A01) {
        // if you want to work with HL7v2 segments directly.
        // Transform HL7v2 PID to FHIR R4 Patient Name.
        r4:HumanName[] patientName = v2tofhirr4:pidToPatientName(hl7msg.pid.pid5,
        hl7msg.pid.pid9);
        io:println("HL7v23 PID Patient Name: ", patientName[0].toString());
    }
}
```
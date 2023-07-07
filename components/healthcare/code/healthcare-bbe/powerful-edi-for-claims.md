---
title: 'Powerful EDI for claims'
description: Ballerina has powerful support for Electronic Interchange Formats (EDI). In healthcare, this means out of the box handling of X12, 834s, 837s and more region specific standards via native schema mapping. Go from EDI formats to Ballerina Records and back; Do Data Mapping on that and you’re off to the races!
image: 'images/health-edi-claims.png'
---
```
public function main() returns error? {
    string enrollmentRequest = check io:fileReadString("enrollments/E0_1.edi");
    m834:EDI_834_Benefit_Enrollment_and_Maintenance enrollment =
         check hmart:read(enrollmentRequest, hmart:EDI_834).ensureType();
    io:println(enrollment.Monetary_Amount_Information[0].Monetary_Amount);
}
```
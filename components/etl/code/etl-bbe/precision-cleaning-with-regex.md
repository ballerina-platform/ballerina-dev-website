---
title: 'Precision Cleaning with regular expressions in Ballerina'
description: "Discover how Ballerina's regex-powered data cleaning effortlessly removes unwanted clutter, 
leaving your data refined and ready for insights.
"
url: 'https://github.com/ShammiL/ETL-code-samples/blob/main/reviewSummary/main.bal'
---
```
public function removeEmailStrings(string inputString) returns string {
    string:RegExp emailPattern =  re `[A-Za-z0-9\._%+-]+@[A-Za-z0-9\.-]+\.[A-Za-z]{2,}`;
    return emailPattern.replaceAll(inputString, "");
}

public function removeSSN(string inputString) returns string {
    string:RegExp ssnPattern = re `\d{3}-\d{2}-\d{4}`;
    return ssnPattern.replaceAll(inputString, "");
}

public function removeExtraWhiteSpaces(string inputString) returns string {
    string:RegExp extraWhiteSpacesPattern = re `\s+`;
    return extraWhiteSpacesPattern.replaceAll(inputString, " ");
}
```

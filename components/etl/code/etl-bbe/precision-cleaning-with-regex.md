---
title: 'Precision cleaning with regular expressions'
description: "Ballerina's regex support empowers data cleansing and standardization, enhancing data quality and consistency."
url: 'https://github.com/ballerina-guides/etl-samples/blob/main/clean-and-standardize-data/main.bal'
phase: 'Transformations'
---
```
function standardizeValues(string inputString) returns int {
    string:RegExp yesPattern = re `y|Y|((y|Y)(e|E)(s|S))`;
    if yesPattern.isFullMatch(inputString) {
        return 1;
    }
    string:RegExp noPattern = re `n|N|((n|N)(o|O))`;
    if noPattern.isFullMatch(inputString) {
        return -1;
    }
    return 0;
}

function isValidEmail(string inputString) returns boolean {
    string:RegExp emailPattern =  re `[A-Za-z0-9\._%+-]+@[A-Za-z0-9\.-]+\.[A-Za-z]{2,}`;
    return emailPattern.isFullMatch(inputString);
}

function removeExtraWhiteSpaces(string inputString) returns string {
    string:RegExp extraSpaces = re `\s+`;
    return extraSpaces.replaceAll(inputString, " ");
}
```

---
title: 'Overcome DSL and XML hurdles with ease'
description: 'Bid farewell to DSL complexities, XML, and workarounds. Embrace a programming language built for integrations, tailored for C-style language developers. With Ballerina, you can easily build custom components, unlocking even greater flexibility. Seamlessly build efficient integration solutions with confidence and ease, while experiencing effortless learning in the process.'
url: 'https://github.com/anupama-pathirage/ballerina-scenarios/tree/main/ballerina-zapier-samples/github-new-issue-assigned-to-trello-card-and-twilio-sms'
---
```
public function main() returns error? {
    file:MetaData[] inputDirectory = check file:readDir("data");
    string outputDirectory = "target/messages/";
    foreach file:MetaData readDirResult in inputDirectory {
        string xmlFilePath = readDirResult.absPath;
        xml message = check io:fileReadXml(xmlFilePath);
        string city = (message/**/<person>/**/<city>).data();
        string fileName = check file:basename(xmlFilePath);
        if city == "London" {
            log:printInfo("UK message");
            check io:fileWriteXml(outputDirectory + "uk/" + fileName, message);
        } else {
            log:printInfo("Other message");
            check io:fileWriteXml(outputDirectory + "others/" + fileName, message);
        }
    }
}
```
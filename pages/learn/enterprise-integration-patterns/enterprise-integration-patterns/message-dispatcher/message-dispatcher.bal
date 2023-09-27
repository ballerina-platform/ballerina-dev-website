import ballerina/http;

final http:Client ocrClient = check new ("http://api.ocr.com.balmock.io");

type OcrResponse record {|
    string[] lines;
    int noOfLines;
    string pdfUrl;
|};

final readonly & string[] ocrProcessors = ["processor1", "processor2", "processor3"];

service / on new http:Listener(8080) {
    int processorNo = 0;

    isolated resource function get ocr(string url) returns OcrResponse|error {
        int currentProcessor;
        lock {
            currentProcessor = self.processorNo;
            self.processorNo = currentProcessor == 2 ? 0 : currentProcessor + 1;
        }
        string processorId = ocrProcessors[currentProcessor];
        return check ocrClient->/[processorId]/parse/imageurl(url = url);
    }
}

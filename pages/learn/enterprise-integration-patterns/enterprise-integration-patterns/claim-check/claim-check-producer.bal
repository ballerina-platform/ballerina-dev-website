import ballerina/http;
import ballerina/io;
import ballerina/mime;
import ballerina/uuid;
import ballerinax/kafka;

final http:Client awsS3Client = check new ("http://bucket.s3.amazonaws.com.balmock,io");
final kafka:Producer kafkaProducer = check new (kafka:DEFAULT_URL);

type ScanRequest record {|
    string patientId;
    stream<byte[], io:Error?> fileByteStream;
|};

service /api/v1 on new http:Listener(8080) {

    isolated resource function post scans/mri(http:Request request) returns error? {
        ScanRequest {patientId, fileByteStream} = check scanRequestFromMultipart(request);

        string claimCheckId = uuid:createType1AsString();
        string fileName = string `${claimCheckId}.dicom`;

        http:Request s3ObjectCreationRequest = new;
        s3ObjectCreationRequest.setByteStream(fileByteStream);
        _ = check awsS3Client->/mri\-scans/[fileName].put(s3ObjectCreationRequest, targetType = http:Response);

        _ = check kafkaProducer->send({
            topic: "topic-mri-scan",
            value: [fileName, patientId]
        });
    }
}

isolated function scanRequestFromMultipart(http:Request request) returns ScanRequest|error {
    mime:Entity[] bodyParts = check request.getBodyParts();
    string? patientId = ();
    stream<byte[], io:Error?>? fileByteStream = ();
    foreach mime:Entity bodyPart in bodyParts {
        string partName = bodyPart.getContentDisposition().name;
        if partName == "patientId" {
            patientId = check bodyPart.getText();
        } else if partName == "file" {
            fileByteStream = check bodyPart.getByteStream();
        }
    }
    if patientId == () || fileByteStream == () {
        return error("Multipart request should contains both patientId and file parts");
    }
    return {fileByteStream, patientId};
}

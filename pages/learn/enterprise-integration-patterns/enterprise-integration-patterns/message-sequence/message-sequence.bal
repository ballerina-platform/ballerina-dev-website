import ballerina/http;
import ballerina/io;

final http:Client s3Client = check new ("http://noname-tech.s3.amazonaws.com.balmock.io");

public function main() returns error? {
    http:Response metaData = check s3Client->/employee_names.head();
    int fileSize = check int:fromString(check metaData.getHeader("Content-Length"));

    check io:fileWriteBytes("./resources/employee_names.txt", []);

    int numberOfChunks = (fileSize + 10 - 1) / 10;
    // Download the data chunk by chunk.
    foreach int i in 0 ..< numberOfChunks {
        map<string> headers = {Range: string `bytes=${10 * i}-${10 * (i + 1) - 1}`};
        http:Response s3Response = check s3Client->/employee_names.get(headers = headers);
        byte[] chunkData = check s3Response.getBinaryPayload();
        check io:fileWriteBytes("./resources/employee_names.txt", chunkData, io:APPEND);
    }
}

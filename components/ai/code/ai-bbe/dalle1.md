```
configurable string googleAccessToken = ?;
configurable string openAIToken = ?;
configurable string sheetId = ?;
configurable string sheetName = ?;
configurable string gDriveFolderId = ?;

public function main() returns error? {
    sheets:Client gSheets = check new ({auth: {token: googleAccessToken}});
    sheets:Column range = check gSheets->getColumn(sheetId, sheetName, "A");

    images:Client openAIImages = check new ({auth: {token: openAIToken}});
    foreach (int|string|decimal) cell in range.values {
        string prompt = check cell.ensureType(string);
        images:CreateImageRequest imagePrompt = {
            prompt,
            response_format: "b64_json"
        };
        images:ImagesResponse imageRes = 
            check openAIImages->/images/generations.post(imagePrompt);

        string encodedImage = check imageRes.data[0].b64_json.ensureType();

        // Decode the Base64 string and store image in Google Drive
        byte[] imageBytes = check array:fromBase64(encodedImage);
        drive:Client gDrive = check new ({auth: {token: googleAccessToken}});
        _ = check gDrive->uploadFileUsingByteArray(imageBytes, string `${prompt}.png`, 
            gDriveFolderId);
    }
}
```
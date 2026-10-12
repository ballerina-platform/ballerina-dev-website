import ballerina/ai;
import ballerina/io;
import ballerinax/ai.openai;

configurable string openAiApiKey = ?;

type Classification record {|
    string category;
    string priority;
|};

public function main() returns error? {
    string message = "My order O-100 arrived damaged. Please replace it.";
    ai:ModelProvider model = check new openai:ModelProvider(
        openAiApiKey, modelType = openai:GPT_4O_MINI);
    Classification|error result = model->generate(`
        Classify this support message as shipping, billing, or product.
        Set priority to low, medium, or high. Message: ${message}`);
    if result is error {
        io:println("Model or result binding failed: ", result.message());
        return result;
    }
    if result.category != "shipping" && result.category != "billing" &&
            result.category != "product" {
        return error("Unexpected category from model");
    }
    if result.priority != "low" && result.priority != "medium" &&
            result.priority != "high" {
        return error("Unexpected priority from model");
    }
    io:println(result);
}

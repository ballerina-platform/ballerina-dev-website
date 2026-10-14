import ballerina/log;
import ballerinax/ai.openai;

configurable string openAiApiKey = ?;

type OrderDetails record {|
    string orderId;
    string item;
    decimal amount;
|};

public function main() returns error? {
    openai:ModelProvider model = check new (openAiApiKey, modelType = openai:GPT_4O_MINI);

    string confirmationEmail = "Order O-204 confirmed: 2x Wireless Mouse, total $39.98.";

    OrderDetails details = check model->generate(
        `Extract order details from: ${confirmationEmail}`);

    log:printInfo("Order details : " + details.toJsonString());
}

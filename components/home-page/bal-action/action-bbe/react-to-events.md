import ballerina/log;
import ballerinax/kafka;

configurable string broker = kafka:DEFAULT_URL;
configurable string inputTopic = "orders";
configurable string outputTopic = "fulfillment";

type Order readonly & record {|
    string orderId;
    string productId;
    int quantity;
|};

final kafka:ConsumerConfiguration consumerConfig = {
    groupId: "fulfillment-example",
    topics: [inputTopic],
    offsetReset: kafka:OFFSET_RESET_EARLIEST
};

service on new kafka:Listener(broker, consumerConfig) {
    private final kafka:Producer producer;

    function init() returns error? {
        self.producer = check new (broker);
    }

    remote function onConsumerRecord(Order[] orders) returns error? {
        foreach Order item in orders {
            json message = {orderId: item.orderId,
                productId: item.productId, status: "READY_TO_PACK"};
            check self.producer->send({topic: outputTopic, value: message});
            log:printInfo("Published fulfillment for " + item.orderId);
        }
    }
}

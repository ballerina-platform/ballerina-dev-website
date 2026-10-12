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
            io:println("Published fulfillment for ", item.orderId);
        }
    }
}

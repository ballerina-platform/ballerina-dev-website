```
import ballerinax/kafka;

configurable string groupId = "order-consumers";
configurable string orders = "orders";
configurable string paymentSuccessOrders = "payment-success-orders";
configurable decimal pollingInterval = 1;
configurable string kafkaEndpoint = kafka:DEFAULT_URL;

type Order readonly & record {|
    int id;
    string desc;
    PaymentStatus paymentStatus;
|};

enum PaymentStatus {
    SUCCESS,
    FAIL
}

final kafka:ConsumerConfiguration consumerConfigs = {
    groupId: groupId,
    topics: [orders],
    offsetReset: kafka:OFFSET_RESET_EARLIEST,
    pollingInterval
};

service on new kafka:Listener(kafkaEndpoint, consumerConfigs) {
    private final kafka:Producer orderProducer;

    function init() returns error? {
        self.orderProducer = check new (kafkaEndpoint);
    }

    remote function onConsumerRecord(Order[] orders) returns error? {
        from Order 'order in orders
            where 'order.paymentStatus == SUCCESS
            do {
                check self.orderProducer->send({
                    topic: paymentSuccessOrders,
                    value: 'order
                });
            };
    }
}
```
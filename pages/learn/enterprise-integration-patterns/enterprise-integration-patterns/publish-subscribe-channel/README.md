How to run the sample
----------------------------
1. Start a [Kafka](https://kafka.apache.org/quickstart) instance.

2. Run the publisher REST service

    ```
    bal run publisher.bal
    ```

3. Run the subscriber WebSocket service

    ```
    bal run subscriber.bal
    ```

4. Run the subscriber client program

    ```
    bal run subscriber_client.bal
    ```

5. Run the tests
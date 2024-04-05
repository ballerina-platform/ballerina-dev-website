---
title: 'Real-time data flow'
description: "Ballerina's support for various data streaming sources, such as Kafka, RabbitMQ, and NATS, facilitates the creation of real-time streaming ETL pipelines."
url: 'https://github.com/ballerina-guides/etl-samples/blob/main/kafka-db-ingestion/main.bal'
phase: 'Loadings'
---
```
final kafka:ConsumerConfiguration consumerConfiguration = {
    groupId: "lead-uuid",
    topics: ["lead-analytics"],
    pollingInterval: 1,
    autoCommit: false
};

final Client leadsDbClient = check new;

listener kafka:Listener kafkaListener = new (kafka:DEFAULT_URL, consumerConfiguration);

isolated service on kafkaListener {
    remote function onConsumerRecord(kafka:Caller caller, LeadAnalytics[] leadsData) returns error? {
        LeadAnalyticsDataInsert[] insertData = from var lead in leadsData
            select {id: uuid:createType1AsString(), ...lead};
        _ = check leadsDbClient->/leadanalyticsdata.post(insertData);
    }
}
```

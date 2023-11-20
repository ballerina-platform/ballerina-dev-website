---
title: 'Seamless Realtime Data Flow: Loading Kafka Topics into Databases with Ballerina'
description: "Experience the effortless integration as Ballerina streamlines the process of 
loading data from Kafka topics into databases, ensuring real-time data flows with precision.
"
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

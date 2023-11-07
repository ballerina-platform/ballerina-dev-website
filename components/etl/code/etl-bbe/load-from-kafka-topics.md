---
title: 'Seamless Realtime Data Flow: Loading Kafka Topics into Databases with Ballerina'
description: "Experience the effortless integration as Ballerina streamlines the process of 
loading data from Kafka topics into databases, ensuring real-time data flows with precision.
"
url: 'https://github.com/ShammiL/ETL-code-samples/blob/main/reviewSummary/main.bal'
phase: 'Loadings'
---
```
final kafka:ConsumerConfiguration consumerConfiguration = {
    groupId: "lead-uuid",
    topics: ["lead-analytics"],
    pollingInterval: 1,
    autoCommit: false
};

final leads:Client leadsDbClient = check new;

listener kafka:Listener kafkaListener = new (kafka:DEFAULT_URL, consumerConfiguration);

service on kafkaListener {
    remote function onConsumerRecord(kafka:Caller caller, LeadAnalyticsData[] leadsData) 
                                                                            returns error? {
        leads:LeadAnalyticsDataInsert[] insertData = from var lead in leadsData 
                                        select {id: uuid:createType1AsString(), ...lead};
        _ = check leadsDbClient->/leadanalyticsdata.post(insertData);
    }
}
```

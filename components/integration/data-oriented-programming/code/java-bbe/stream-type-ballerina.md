---
title: 'Ballerina'
description: null
---
```
import ballerina/io;

const string FILE_PATH = "/path/to/file.csv";

type SensorData record {|
    string sensorName;
    string timestamp;
    float temperature;
    float humidity;
|};

public function main() returns error? {
    // Read file as a stream which will be lazily evaluated
    stream<SensorData, error?> sensorDataStrm = check io:fileReadCsvAsStream(FILE_PATH);
    map<float>? ecoSenseAvg = check processSensorData(sensorDataStrm);
    io:println(ecoSenseAvg);
}

function processSensorData(stream<SensorData, error?> sensorDataStrm) returns map<float>|error? {
    map<float> avgTemperatureMap = {};
    check from var {sensorName, temperature} in sensorDataStrm
        let () _ = check validateTemperatureReading(sensorName, temperature) 
        group by sensorName
        do {
            float avg = float:avg(temperature);
            avgTemperatureMap[sensorName] = avg;
        };
        return avgTemperatureMap;
}

function validateTemperatureReading(string sensorName, float temperature) returns error? {
    if (temperature < 0.0) {
        // stops processing the stream; sensor reading is faulty
        fail error(string `Invalid temperature value in sensor ${sensorName}`);
    }
}
```
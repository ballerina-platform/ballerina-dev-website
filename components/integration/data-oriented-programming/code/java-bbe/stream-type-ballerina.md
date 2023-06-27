---
title: 'Ballerina'
description: null
---
```
import ballerina/io;

const string FILE_PATH = "/path/to/file.txt";

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
    return check map from var {sensorName, temperature} in sensorDataStrm
        // if sensor reading is faulty, stops processing the file 
        let () _ = check validateTemperatureReading(sensorName, temperature)
        group by sensorName
        select [sensorName, avg(temperature)];
}

function validateTemperatureReading(string sensorName, float temperature) returns error? {
    if (temperature < 0.0) {
        fail error(string `Invalid temperature value in sensor ${sensorName}`);
    }
}
```
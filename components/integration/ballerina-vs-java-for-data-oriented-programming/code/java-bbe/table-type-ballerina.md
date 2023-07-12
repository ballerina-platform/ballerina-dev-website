---
title: 'Ballerina'
description: null
---
```
import ballerina/io;

type SensorData record {|
    string sensorName;
    string timestamp;
    float temperature;
    float humidity;
|};

public function main(string filePath = "sensor_data.csv") returns error? {
    // Read file as a stream which will be lazily evaluated
    stream<SensorData, error?> sensorDataStrm = check io:fileReadCsvAsStream(filePath);
    map<float> ecoSenseAvg = check map from var {sensorName, temperature} in sensorDataStrm
        // if sensor reading is faulty; stops processing the file 
        let float tempInCelcius = check convertTemperatureToCelcius(sensorName, temperature)
        group by sensorName
        select [sensorName, avg(tempInCelcius)];
    io:println(ecoSenseAvg);
}

function convertTemperatureToCelcius(string sensorName, float temperature) returns float|error {
    if temperature < 0.0 || temperature > 10000.0 {
        return error(string `Invalid kelvin temperature value in sensor: ${sensorName}`);
    }
    return temperature - 273.15;
}
```
import ballerina/http;

const PROJECT_ID = "LAND-TEST04";
const DATASET_ID = "f57074a0-a8b6-403e-9df1-e9fc46";

final http:Client gMapClient = check new ("http://mapsplatformdatasets.googleapis.com.balmock.io");
final http:Client microsoftClient = check new ("http://atlas.microsoft.com.balmock.io");

type Gpx xml;

type Kml xml;

type Csv record {|
    float X;
    float Y;
    string Name;
    string Description;
|}[];

type GeoJson record {
    string 'type = "FeatureCollection";
    string name = "PlaceMarks";
    Feature[] features;
};

type Feature record {|
    string 'type = "Feature";
    record {|
        string X;
        string Y;
        string Name;
        string description;
    |} properties;
    record {|
        string 'type = "Point";
        string[] coordinates;
    |} geometry;
|};

type GMapResponse record {
    string name;
    string displayName;
    string createTime;
};

type MicrosoftMapResponse record {
    string formatVersion;
    record {
        record {
            string latitude;
            string longitude;
        }[] points;
    }[] routes;
};

service /map on new http:Listener(8080) {
    resource function post uploadPlaceMarks(http:Request request) returns GMapResponse|error? {
        Csv|Gpx data = check getPayload(request);
        GeoJson geoJson = convertToCanonical(data);
        Kml kmlData = convertFromCanonicalToKml(geoJson);
        GMapResponse gMapResponse = check gMapClient->post(
            string `/v1/projects/${PROJECT_ID}/datasets/${DATASET_ID}:import`, kmlData);
        return gMapResponse;
    }

    resource function post getRouteDirection(http:Request request, string query) returns MicrosoftMapResponse|error {
        Csv|Gpx data = check getPayload(request);
        GeoJson geoJson = convertToCanonical(data);
        MicrosoftMapResponse microsoftMapResponse = check microsoftClient->/route/directions/'json.post(
            {"supportingPoints": geoJson.toJson()}, {query: string `${query}`}
        );
        return microsoftMapResponse;
    }
}

isolated function convertToCanonical(Csv|Gpx data) returns GeoJson {
    if data is Csv {
        return convertFromCsvToCanonical(data);
    } else {
        return convertFromGpxToCanonical(data);
    }
}

isolated function getPayload(http:Request request) returns Csv|Gpx|error {
    if request.getContentType().includes("xml") {
        return request.getXmlPayload();
    }
    json data = check request.getJsonPayload();
    return data.cloneWithType(Csv);
}

isolated function convertFromCsvToCanonical(Csv data) returns GeoJson {
    return {
        features: from var member in data
                  let string X = member.X.toString(), string Y = member.Y.toString()
                  select {
                      properties: {X, Y, Name: member.Name, description: member.Description},
                      geometry: {coordinates: [X, Y]}
                  }
    };
}

isolated function convertFromGpxToCanonical(Gpx gpxData) returns GeoJson {
    return {
        features: from var extension in gpxData/**/<extensions>
            select {
                properties: {
                    X: (extension/**/<X>).data(),
                    Y: (extension/**/<X>).data(),
                    Name: (extension/**/<Name>).data(),
                    description: (extension/**/<description>).data()
                },
                geometry: {coordinates: [(extension/**/<X>).data(), (extension/**/<Y>).data()]}
            }
    };
}

isolated function convertFromCanonicalToKml(GeoJson geoJson) returns Kml {
    xml kmlData = xml `<kml>
        <Document>
            <Schema id="temp">
                <SimpleField name="X" type="double"/>
                <SimpleField name="Y" type="double"/>
                <SimpleField name="Name" type="string"/>
            </Schema>
            ${from Feature feature in geoJson.features
              select xml `<Placemark>
                            <description>${feature.properties.description}</description>
                            <Point>
                                <coordinates>
                                    ${feature.geometry.coordinates[0]},${feature.geometry.coordinates[1]}
                                </coordinates>
                            </Point>
                          </Placemark>`}
            </Document>
        </kml>`;
    return kmlData;
}

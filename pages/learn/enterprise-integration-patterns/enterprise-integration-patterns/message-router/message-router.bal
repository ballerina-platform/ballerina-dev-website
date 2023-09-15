import ballerina/http;

type DhlUkResponse record {|
    string url;
    record {|
        string id;
        Status status;
    |}[] shipments;
|};

type DhlDpiResponse record {|
    Status[] events;
    string publicUrl;
    string barcode;
|};

type Status record {|
    string statusCode;
    string status;
|};

enum Country {
    UK,
    DE
}

final http:Client dhl = check new ("http://api.dhl.com.balmock.io");

service /shipments on new http:Listener(8080) {

    resource function get [Country country]/[string trackingNumber]/status() returns string|error {
        match country {
            UK => {
                DhlUkResponse response = check dhl->/parceluk/tracking/v1/shipments(trackingNumber = trackingNumber);
                return response.shipments[0].status.status;
            }
            DE => {
                DhlDpiResponse response = check dhl->/dpi/tracking/v1/trackings/[trackingNumber];
                return response.events[0].status;
            }
            _ => {
                return error("County not supported");
            }
        }
    }
}

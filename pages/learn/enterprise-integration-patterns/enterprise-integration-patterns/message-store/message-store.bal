import ballerina/http;

type GeoCodeResponse record {|
    json results;
|};

final http:Client geoCodingClient = check new ("http://api.maps.googleapis.com.balmock.io");
final http:Client firebaseClient = check new ("http://api.mapsproject.firebase.com.balmock.io");

service /api on new http:Listener(8080) {
    
    resource function get location(string address) returns GeoCodeResponse|error {
        GeoCodeResponse|error storedGeocode = firebaseClient->/location/[address]/["location.json"]();
        if storedGeocode !is error {
            return storedGeocode;
        }
        GeoCodeResponse geocode = check geoCodingClient->/maps/api/geocode/'json(place=address);
        json _ = check firebaseClient->/location/["location.json"].put({address: geocode});
        return geocode;
    }
}

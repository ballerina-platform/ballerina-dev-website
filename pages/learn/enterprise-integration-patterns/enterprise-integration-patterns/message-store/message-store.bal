import ballerina/http;

type GeoCodeResponse record {|
    json results;
|};

final http:Client geoCodingClient = check new ("http://api.maps.googleapis.com.balmock.io");
final http:Client firebaseClient = check new ("http://api.mapsproject.firebase.com.balmock.io");

service /api on new http:Listener(8080) {
    
    resource function get location(string address) returns GeoCodeResponse|error {
        GeoCodeResponse|error storedGeocode = firebaseClient->/location/[address]/location\.json();
        if storedGeocode !is error {
            return storedGeocode;
        }
        GeoCodeResponse geocode = check geoCodingClient->/maps/api/geocode/'json(place=address);
        var _ = start storeAddress(address, geocode);
        return geocode;
    }
}

function storeAddress(string address, GeoCodeResponse geocode) returns error? {
    _ = check firebaseClient->/location/[address]/location\.json.put(geocode, targetType = json);
}

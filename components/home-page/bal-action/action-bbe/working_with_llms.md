```
import ballerina/http;

configurable int port = 8080;

type Attraction record {|
    string name;
    string city;
    string highlight;
|};

service on new http:Listener(port) {
    resource function get attractions(string country, string interest, int count = 5) 
            returns Attraction[]|http:InternalServerError {

        Attraction[]|error attractions = natural {
            Tell me the top ${count} attractions to visit in ${country} which are 
            good for a tourist who has an interest in ${interest} to visit.  
            Include a highlight one-liner about that place.
        };

        if attractions is Attraction[] {
            return attractions;
        }
        return {body: "Failed to fetch attractions"};
    }
}
```
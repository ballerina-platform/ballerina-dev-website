```
import ballerina/ai;
import ballerina/http;

final ai:ModelProvider model = check ai:getDefaultModelProvider();

type Attraction record {|
    string name;
    string city;
    string highlight;
|};

service on new http:Listener(8080) {
    resource function get attractions(string country, string interest, int count = 5) 
            returns Attraction[]|http:InternalServerError {

        Attraction[]|error attractions = natural (model) {
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
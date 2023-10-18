import ballerina/uuid;
import ballerina/websocket;
import ballerinax/kafka;

service /ws on new websocket:Listener(8081) {

    resource function get [string matchId]() returns websocket:Service|error {
        return new MatchUpdateService(matchId);
    }
}

isolated service class MatchUpdateService {
    *websocket:Service;
    private final kafka:Consumer kafkaConsumer;

    public function init(string matchId) returns error? {
        self.kafkaConsumer = check new (kafka:DEFAULT_URL, {
            groupId: string `realtime-web-ui-group-${uuid:createType1AsString()}`,
            topics: [matchId]
        });
    }

    isolated remote function onOpen(websocket:Caller caller) returns error? {
        while true {
            anydata[] matchDetails = check self.kafkaConsumer->pollPayload(1);
            from var matchDetail in matchDetails
            do {
                check caller->writeMessage(matchDetail);
            };
        }
    }
}

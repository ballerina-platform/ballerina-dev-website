import ballerina/http;
import ballerinax/kafka;

type MatchEvent record {|
    string matchId;
    string time;
    string event;
    string description;
|};

service /api on new http:Listener(8080) {

    private final kafka:Producer kafkaPublisher;

    function init() returns error? {
        self.kafkaPublisher = check new (kafka:DEFAULT_URL);
    }

    resource function post cricket/matches/[string matchId]/event(MatchEvent event) returns error? {
        check self.kafkaPublisher->send({
            topic: matchId,
            value: event
        });
    }
}

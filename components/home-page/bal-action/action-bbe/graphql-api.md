```
import ballerina/graphql;
import ballerina/http;
import ballerinax/mysql;
import ballerinax/mysql.driver as _;

configurable string user = ?;
configurable string password = ?;
configurable string host = ?;
configurable int port = ?;
configurable string database = ?;
configurable string apiEndpoint = ?;

public type Album record {
    string id;
    string title;
    string artist;
    float price;
    Currency currency = USD;
};

public enum Currency {
    USD,
    LKR,
    EUR,
    GBP
}

service / on new graphql:Listener(9000) {
    private final mysql:Client db;
    private final http:Client forex;
    private final Currency baseCurrency = USD;

    function init() returns error? {
        self.db = check new (host, user, password, database, port);
        self.forex = check new (apiEndpoint);
    }

    resource function get album(string id, Currency currency = USD) returns Album|error {
        Album album = check self.db->queryRow(`SELECT * FROM Albums WHERE id=${id}`);
        if currency != self.baseCurrency {
            record {float rate;} exchange = check self.forex->/currencyConversion('from = self.baseCurrency, to = currency);
            album.price = album.price * exchange.rate;
            album.currency = currency;
        }
        return album;
    }
}
```
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
    decimal price;
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

    resource method get album(string id, Currency currency = USD) returns Album|error {
        Album album = check self.db->queryRow(`SELECT * FROM Albums WHERE id=${id}`);
        if currency != self.baseCurrency {
            string query = string `from=${self.baseCurrency}&to=${currency}`;
            record {decimal rate;} exchange = check self.forex->get(string `/curerncyConversion?${query}`);
            album.price = album.price * exchange.rate;
            album.currency = currency;
        }
        return album;
    }
}
```
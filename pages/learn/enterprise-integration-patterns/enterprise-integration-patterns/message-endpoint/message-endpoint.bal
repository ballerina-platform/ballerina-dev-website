import ballerina/http;

type Currency "AUD"|"INR"|"BGP";

final readonly & map<decimal> rates = {
    "AUD": 1.59,
    "INR": 83.24,
    "GBP": 0.83
};

service /api/v1/rates on new http:Listener(8080) {
    isolated resource function get covert(Currency base, Currency target, decimal amount = 1.00) returns decimal {
        decimal baseUsdValue = rates.get(base);
        decimal targetUsdValue = rates.get(target);
        return (targetUsdValue / baseUsdValue) * amount;
    }
}

import ballerina/http;

type SalesByStateRequest record {|
    string[] states;
|};

type SalesByState record {|
    decimal revenue;
    decimal operatingExpenses;
    int production;
    int totalEmployees;
|};

type AggregratedSales record {|
    map<decimal> revenueByState = {};
    decimal totalRevenue = 0.0;
    decimal maxRevenue = 0.0;
    string maxRevenueState = "";
    map<decimal> operatingExpensesByState = {};
    decimal totalOperatingExpenses = 0.0;
    int totalProduction = 0;
    map<int> productivityByState = {};
|};

final map<http:Client> stateRoutes = {
    Texas: check new ("http://api.texas.office.com.balmock.io"),
    Ohio: check new ("http://api.ohio.office.com.balmock.io"),
    Florida: check new ("http://api.florida.office.com.balmock.io")
};

service /api/v1 on new http:Listener(8080) {
    resource function post dashboard(SalesByStateRequest salesRequest) returns AggregratedSales|error {
        AggregratedSales summary = {};
        foreach string state in salesRequest.states {
            http:Client? stateClient = stateRoutes[state];
            if stateClient == () {
                return error("Invalid state provided");
            }
            SalesByState salesByState = check stateClient->/sales();
            aggregateSales(summary, state, salesByState);
        }
        return summary;
    }
}

function aggregateSales(AggregratedSales summary, string state, SalesByState salesByState) {
    summary.revenueByState[state] = salesByState.revenue;
    summary.totalRevenue += salesByState.revenue;
    summary.operatingExpensesByState[state] = salesByState.operatingExpenses;
    summary.totalOperatingExpenses += salesByState.operatingExpenses;
    summary.totalProduction += salesByState.production;
    summary.maxRevenueState = summary.maxRevenue < salesByState.revenue ? state : summary.maxRevenueState;
    summary.maxRevenue = summary.maxRevenue < salesByState.revenue ? salesByState.revenue : summary.maxRevenue;
    summary.productivityByState[state] = salesByState.production / salesByState.totalEmployees;
}

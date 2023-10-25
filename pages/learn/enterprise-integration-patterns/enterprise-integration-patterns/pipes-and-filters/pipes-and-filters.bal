import ballerina/http;

type EmployeePerformance record {|
    string empId;
    int productivity;
    int customerSatisfaction;
    int goalAchievement;
|};

type TopPerformer record {|
    string empId;
    float performance;
|};

final http:Client firebaseClient = check new ("http://api.employee.performance.firebase.com.balmock.io");

service /api/v1 on new http:Listener(8080) {
    isolated resource function get employee/top\-performers(int count) returns TopPerformer[]|error {
        EmployeePerformance[] employeePerformace = check firebaseClient->/performance\.json();
        return from var {empId, productivity, customerSatisfaction, goalAchievement} in employeePerformace
               let float performance = productivity * 0.3 + customerSatisfaction * 0.1 + goalAchievement * 0.6
               where performance > 7.5
               limit count
               order by performance descending
               select {empId, performance};
    }
}

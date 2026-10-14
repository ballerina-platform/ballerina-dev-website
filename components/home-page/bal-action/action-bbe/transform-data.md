import ballerina/io;
import ballerina/log;

type Customer record {|
    string id;
    string name;
    string email;
    boolean active;
|};

public function main() returns error? {
    json input = check io:fileReadJson("input.json");
    Customer[] customers = check input.cloneWithType();
    xml contactsXml = xml `<contacts>${
        from Customer customer in customers
        where customer.active
        select xml `<contact><email>${customer.email}</email></contact>`
    }</contacts>`;
    log:printInfo("XML: " + contactsXml.toString());
}

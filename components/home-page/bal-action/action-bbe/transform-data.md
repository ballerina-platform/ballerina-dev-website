import ballerina/io;

type Customer record {|
    string id;
    string name;
    string email;
    boolean active;
|};

type Contact record {|
    string externalId;
    string displayName;
    string email;
|};

public function main() returns error? {
    json input = check io:fileReadJson("input.json");
    Customer[] customers = check input.cloneWithType();
    Contact[] contacts = from Customer customer in customers
        where customer.active
        select {
            externalId: customer.id,
            displayName: customer.name,
            email: customer.email
        };
    json contactsJson = contacts.toJson();
    xml contactsXml = xml `<contacts>${from var {externalId, displayName, email} in contacts
        select xml `<contact id="${externalId}"><name>${displayName}</name><email>${email}</email></contact>`}</contacts>`;
    io:println("JSON: ", contactsJson);
    io:println("XML: ", contactsXml);
}

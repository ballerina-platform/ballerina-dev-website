public function main() {
    Customer[] customers = [
        {id: "C-101", name: "Asha Perera", email: "asha@example.com", active: true},
        {id: "C-102", name: "Milan Silva", email: "milan@example.com", active: false}
    ];
    Contact[] contacts = from Customer customer in customers
        where customer.active
        select {
            externalId: customer.id,
            displayName: customer.name,
            email: customer.email
        };
    io:println(contacts);
}

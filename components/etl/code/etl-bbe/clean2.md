```
public type Customer record {|
    string name;
    string city;
    string phone;
|};

function findDuplicates(Customer[] customers) returns [Customer[], Customer[]] {
    Customer[] duplicates = [];
    Customer[] uniqueCustomers = [customers[0]];
    foreach int customerIdx in 1 ... customers.length() - 1 {
        foreach Customer uniqueCustomer in uniqueCustomers {
            Customer customer = customers[customerIdx];
            if getEditDistance(customer.name, uniqueCustomer.name) < 3 &&
                getEditDistance(customer.city, uniqueCustomer.city) < 2 &&
                getEditDistance(customer.phone, uniqueCustomer.phone) < 4 {
                duplicates.push(customer);
            } else {
                uniqueCustomers.push(customer);
            }
        }
    }
    return [uniqueCustomers, duplicates];
}
```

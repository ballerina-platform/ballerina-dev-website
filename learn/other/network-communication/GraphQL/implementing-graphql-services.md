---
layout: ballerina-left-nav-pages-swanlake
title: Implementing GraphQL services
description: In Ballerina, the GraphQL object structure is modeled using services. A Ballerina GraphQL service contains resource methods that map to the fields of the GraphQL objects and work as resolver functions to provide its data. The GraphQL schema is automatically derived from this service structure and its resources. 
keywords: ballerina, cli, command-line interface, programming language
permalink: /learn/user-guide/network-communication/graphql/implementing-graphql-services/
active: implementing-graphql-services
intro:  In Ballerina, the GraphQL object structure is modeled using services. A Ballerina GraphQL service contains resource methods that map to the fields of the GraphQL objects and work as resolver functions to provide its data. The GraphQL schema is automatically derived from this service structure and its resources. 
redirect_from:
  - /learn/user-guide/network-communication/graphql/implementing-graphql-services
redirect_to:
  - https://lib.ballerina.io/ballerina/graphql/latest/
---

The topics below demonstrates how to implement an [order information query scenario](/learn/user-guide/network-communication/graphql#introducing-the-use-case) using a Ballerina service. 

## Writing the GraphQL service

Start with the Ballerina GraphQL service implementation below, which represents the GraphQL root `Query` object fields. 


```ballerina
import ballerina/graphql;
 
service graphql:Service /query on new graphql:Listener(8080) {
 
   resource function get 'order(int id) 
                          returns Order|error => loadOrder(id);
 
}
```

This example code includes a single resource function `order`, which takes in the `id` parameter and returns an instance of the `Order` service class. The `loadOrder` function and the `Order` service class are implemented in the following way. 

```ballerina
function loadOrder(int id) returns Order|error {
   stream<record{}, error> rs = dbClient->query(`SELECT id, customerId,
                                                 shipperId, date, notes
                                                 FROM ORDERS WHERE id = 
                                                 ${id}`, OrderData);
   var rec = check rs.next();
   check rs.close();
   if !(rec is ()) {
       return new Order(<OrderData> rec["value"]);
   } else {
       return error(string `Invalid order: ${id}`);
   }
}

service class Order {
 
   private OrderData data;
 
   function init(OrderData data) {
       self.data = data;
   }
 
   resource function get notes() returns string {
       return self.data.notes;
   }
 
   resource function get date() returns string {
       return self.data.date;
   }
 
   resource function get customer() returns Customer|error {
       return check loadCustomer(self.data.customerId);
   }
 
   resource function get shipper() returns Shipper|error {
       return check loadShipper(self.data.shipperId);
   }
}
```

Here, you execute the required SQL query to load the `Order` table data and populate the `Order` object. 

>**Note:"** You do not load the `customer` and `shipper` information right away. Rather, these are loaded lazily if and when it’s required as expressed through the incoming GraphQL query. 

The `loadCustomer` function shown below is used in the `customer` resource function to load the customer information from the database and populate a `Customer` object. 

```ballerina
function loadCustomer(int id) returns Customer|error {
   stream<record{}, error> rs = dbClient->query(`SELECT id, name, address
                                                 FROM CUSTOMER WHERE id = 
                                                 ${id}`, CustomerData);
   var rec = check rs.next();
   check rs.close();
   if !(rec is ()) {
       return new Customer(<CustomerData> rec["value"]);
   } else {
       return error(string `Invalid customer: ${id}`);
   }
}

service class Customer {
 
   private CustomerData data;
 
   function init(CustomerData data) {
       self.data = data;
   }
 
   resource function get name() returns string {
       return self.data.name;
   }
 
   resource function get address() returns string {
       return self.data.address;
   }
}
```

Similarly, the `shipper` resource function is implemented to query the corresponding GraphQL object field. 

The complete Ballerina source code for our scenario is shown below.

```ballerina
import ballerina/graphql;
import ballerinax/mysql;
 
mysql:Client dbClient = check new(database = "ORDER_DB", user = "root", password = "root");
 
type OrderData record {
   int id;
   int customerId;
   int shipperId;
   string date;
   string notes;
};
 
type CustomerData record {
   int id;
   string name;
   string address;
};
 
type ShipperData record {
   int id;
   string name;
   string phone;
};
 
service class Customer {
 
   private CustomerData data;
 
   function init(CustomerData data) {
       self.data = data;
   }
 
   resource function get name() returns string {
       return self.data.name;
   }
 
   resource function get address() returns string {
       return self.data.address;
   }
}
 
service class Shipper {
 
   private ShipperData data;
 
   function init(ShipperData data) {
       self.data = data;
   }
 
   resource function get name() returns string {
       return self.data.name;
   }
 
   resource function get phone() returns string {
       return self.data.phone;
   }
}
 
service class Order {
 
   private OrderData data;
 
   function init(OrderData data) {
       self.data = data;
   }
 
   resource function get notes() returns string {
       return self.data.notes;
   }
 
   resource function get date() returns string {
       return self.data.date;
   }
 
   resource function get customer() returns Customer|error {
       return check loadCustomer(self.data.customerId);
   }
 
   resource function get shipper() returns Shipper|error {
       return check loadShipper(self.data.shipperId);
   }
}
 
service graphql:Service /query on new graphql:Listener(8080) {
 
   resource function get 'order(int id) returns Order|error => loadOrder(id);
 
}
 
function loadOrder(int id) returns Order|error {
   stream<record{}, error> rs = dbClient->query(`SELECT id, customerId, shipperId, date, notes
                                                 FROM ORDERS WHERE id = ${id}`, OrderData);
   var rec = check rs.next();
   check rs.close();
   if !(rec is ()) {
       return new Order(<OrderData> rec["value"]);
   } else {
       return error(string `Invalid order: ${id}`);
   }
}
 
function loadCustomer(int id) returns Customer|error {
   stream<record{}, error> rs = dbClient->query(`SELECT id, name, address
                                                 FROM CUSTOMER WHERE id = ${id}`, CustomerData);
   var rec = check rs.next();
   check rs.close();
   if !(rec is ()) {
       return new Customer(<CustomerData> rec["value"]);
   } else {
       return error(string `Invalid customer: ${id}`);
   }
}
 
function loadShipper(int id) returns Shipper|error {
   stream<record{}, error> rs = dbClient->query(`SELECT id, name, phone
                                                 FROM SHIPPER WHERE id = ${id}`, ShipperData);
   var rec = check rs.next();
   check rs.close();
   if !(rec is ()) {
       return new Shipper(<ShipperData> rec["value"]);
   } else {
       return error(string `Invalid shipper: ${id}`);
   }
}
```

## Executing the GraphQL service

Follow the steps below to do a test run using the full Ballerina service implementation. 

1. Navigate to the `ordersvc` directory, which contains the Ballerina package and the database script, and execute the command below to create and populate the database.

   >**Tip:** This example uses a MySQL database to provide the data.

   ```bash
   $ mysql -u root -p < db.sql
   ```

2. Execute the command below to run the default module of your Ballerina package.

   ```bash
   $ bal run .
   ```

   You view the output below.

   ```bash
   Compiling source
         laf/ordersvc:0.1.0

   Creating balo
         target/balo/laf-ordersvc-any-0.1.0.balo

   Running executable

   [ballerina/http] started HTTP/WS listener 0.0.0.0:8080
   ```

   .**Info:** Now, the service is available locally at port 8080, and the service is accessible at “http://localhost:8080/query”. 

3. Execute the commands below to send a few GraphQL requests to the service. 

   ```bash
   curl -X POST -H "Content-type: application/json" -d '{ "query": "{ order(id: 2) { notes, date, customer { name, address }, shipper { name, phone } } }" }' 'http://localhost:8080/query'

   {
      "data": {
         "order": {
            "notes": "Street pickup",
            "date": "2021/01/25",
            "customer": {
               "name": "Nimal Perera",
               "address": "No 22, Galle Road, Colombo 02"
            },
            "shipper": {
               "name": "UPS",
               "phone": "(408)275-4415"
            }
         }
      }
   }
   ```

   ```bash
   curl -X POST -H "Content-type: application/json" -d '{ "query": "{ order(id: 1) { notes, customer { name, address } } }" }' 'http://localhost:8080/query'

   {
      "data": {
         "order": {
            "notes": "Doorstep delivery",
            "customer": {
               "name": "Jack Smith",
               "address": "No 10, N 1st St, San Jose"
            }
         }
      }
   }
   ```

>**Info:** Ballerina GraphQL services also support GraphQL introspection. For example, you can execute the query below to look up the types available in the service. 

```bash
curl -X POST -H "Content-type: application/json" -d '{ "query": "{ __schema { types { name } } }" }' 'http://localhost:8080/query'
{
    "data": {
   	 "__schema": {
   		 "types": [{
   			 "name": "Order"
   		 }, {
   			 "name": "__TypeKind"
   		 }, {
   			 "name": "__Field"
   		 }, {
   			 "name": "Query"
   		 }, {
   			 "name": "__Type"
   		 }, {
   			 "name": "Customer"
   		 }, {
   			 "name": "Shipper"
   		 }, {
   			 "name": "__InputValue"
   		 }, {
   			 "name": "String"
   		 }, {
   			 "name": "Int"
   		 }, {
   			 "name": "__Schema"
   		 }]
   	 }
    }
}
```

<style> #tree-expand-all, #tree-collapse-all, .cTocElements {display:none;} .cGitButtonContainer {padding-left: 40px;} </style>

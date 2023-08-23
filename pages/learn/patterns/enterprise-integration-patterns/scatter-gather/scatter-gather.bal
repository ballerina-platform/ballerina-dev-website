import ballerina/http;

type CarRental record {|
    string carType;
    string price;
    string resultLink;
    string vendor;
|};

type AvisResponse record {
    record {
        *CarRental;
    }[] result;
};

final http:Client hotwireEP = check new ("http://api.hotwire.com.balmock.io");
final http:Client avisEP = check new ("http://api.avis.com.balmock.io");

service /api/v1 on new http:Listener(8080) {
    
    resource function get vehicles(string dropOffDateTime, string dropOffLocation, string pickupDateTime,
    string pickupLocation) returns map<CarRental[]>|error {
    
        worker hotwire returns CarRental[]|error {
            http:Response hotwireResponse = check hotwireEP -> /v1/search/car.get(pickup=pickupLocation, 
                dest=dropOffLocation, startDate=pickupDateTime, endDate=dropOffDateTime);
            return transformHotwireResponse(check hotwireResponse.getXmlPayload());
        }

        worker avis returns CarRental[]|error {
            AvisResponse avisResponse = check avisEP -> /cars/catalog/v1/vehicles/rates.get(brand="Avis", 
                country_code="US", dropOff_date=dropOffDateTime, dropoff_location=dropOffLocation,
                pickup_date=pickupDateTime, pickup_location=pickupLocation);
            return transformAvisResponse(avisResponse);
        }

        var responses = wait {hotwire, avis} ;
        return map from var [vendor, carRental] in responses.entries() 
                where carRental !is error
                select [vendor, carRental];
    }
}

function transformHotwireResponse(xml response) returns CarRental[] {
    return from xml item in response/<Response>/<Car> 
        select {
            carType: (item/<CarType>).data(),
            price: (item/<Price>).data(),
            resultLink: (item/<ResultLink>).data(),
            vendor: "Hotwire"
        };
}

function transformAvisResponse(AvisResponse response) returns CarRental[] {
    return from var {carType, price, resultLink, vendor} in response.result
        select {carType, price, resultLink, vendor};
}

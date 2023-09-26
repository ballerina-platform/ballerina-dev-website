import ballerina/http;

public type PatientReqV1 record {|
    "1.0" version = "1.0";
    string firstName;
    string lastName;
    string dob;
    string diagnosis;
|};

public type PatientReqV2 record {|
    "2.0" version = "2.0";
    Patient patient;
|};

type PatientReq PatientReqV1|PatientReqV2;  

public type Patient record {|
    string fullName;
    string dob;
    string diagnosis;
|};

final http:Client patientClient = check new ("http://api.patients.com.balmock.io");

service /api/v1 on new http:Listener(8080) {
    
    resource function post data/patient(PatientReq patintReq) returns error? {
        Patient patient;
        if patintReq is PatientReqV1 {
            patient = {
                dob: patintReq.dob,
                fullName: patintReq.firstName + " " + patintReq.lastName,
                diagnosis: patintReq.diagnosis
            };
        } else {
            patient = {
                dob: patintReq.patient.dob,
                fullName: patintReq.patient.fullName,
                diagnosis: patintReq.patient.diagnosis
            };
        }
        _ = check patientClient->/patient.post(patient, targetType = http:Response);
    }

    resource function post patient(Patient patient) returns error? {
        _ = check patientClient->/patient.post(patient, targetType = http:Response);
    }
}

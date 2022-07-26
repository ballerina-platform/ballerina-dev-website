import * as React from 'react';
import { Row, Col, Tabs, Tab, Container } from 'react-bootstrap';
import Image from 'next-image-export-optimizer';

import { prefix } from '../../../utils/prefix';
import styles from './BalAction.module.css';

import { getHighlighter, setCDN } from "shiki";

setCDN("https://unpkg.com/shiki/");

export default function BalAction() {
  const [key, setKey] = React.useState('consuming-services');
  let hash = global.location.hash;

  React.useEffect(() => {
    if (hash !== '') {
      hash = hash.replace('#', '');
      setKey(hash);
      const element = document.getElementById("ballerina-in-action");
      element.scrollIntoView();
    }
  }, [hash]);

  const HighlightSyntax = (code, language) => {
    const [codeSnippet, setCodeSnippet] = React.useState([]);

    React.useEffect(() => {

      async function fetchData() {
        getHighlighter({
          theme: "css-variables",
          langs: ['ballerina']
        }).then((highlighter) => {
          setCodeSnippet(highlighter.codeToHtml(code, language));
        })
      }
      fetchData();
    }, [code, language]);

    return [codeSnippet]
  }



  const ConsumerServices = `import ballerina/http;
import ballerinax/googleapis.sheets;
  
configurable string githubPAT = ?;
configurable string repository = "ballerina-platform/ballerina-lang";
configurable string sheetsAccessToken = ?;
configurable string spreadSheetId = ?;
configurable string sheetName = "Sheet1";

type PR record {
    string url;
    string title;
    string state;
    string created_at;
    string updated_at;
};

public function main() returns error? {
    http:Client github = check new ("https://api.github.com/repos");
    map<string> headers = {
        "Accept": "application/vnd.github.v3+json",
        "Authorization": "token " + githubPAT
    };
    PR[] prs = check github->get(string \`/$\{repository\}/pulls\`, headers);

    sheets:Client gsheets = check new ({auth: {token: sheetsAccessToken}});
    check gsheets->appendRowToSheet(spreadSheetId, sheetName,
            ["Issue", "Title", "State", "Created At", "Updated At"]);

    foreach var {url, title, state, created_at, updated_at} in prs {
        check gsheets->appendRowToSheet(spreadSheetId, sheetName,
                [url, title, state, created_at, updated_at]);
    }
}`;

  const workingWithData = `import ballerina/http;
import ballerina/io;

type Country record {
    string country;
    int population;
    string continent;
    int cases;
    int deaths;
};

// Prints the top 10 countries having the highest case-fatality ratio.
public function main() returns error? {
    http:Client diseaseEp = check new ("https://disease.sh/v3");
    Country[] countries = check diseaseEp->get("/covid-19/countries");

    json summary =
        from var {country, continent, population, cases, deaths} in countries
            where population >= 100000 && deaths >= 100
            let decimal caseFatalityRatio = &lt;decimal&gt;deaths / &lt;decimal&gt;cases * 100
            order by caseFatalityRatio descending
            limit 10
            select {country, continent, population, caseFatalityRatio};
    io:println(summary);
}`;

  const restfulApi = `import ballerina/http;

configurable int port = 8080;

type Album readonly & record {|
    string id;
    string title;
    string artist;
    decimal price;
|};

table&lt;Album&gt; key(id) albums = table [
        {id: "1", title: "Blue Train", artist: "John Coltrane", price: 56.99},
        {id: "2", title: "Jeru", artist: "Gerry Mulligan", price: 17.99},
        {id: "3", title: "Sarah Vaughan and Clifford Brown", artist: "Sarah Vaughan", price: 39.99}
    ];

service / on new http:Listener(port) {
    resource function get albums() returns Album[] {
        return albums.toArray();
    }

    resource function get albums/[string id]() returns Album|http:NotFound {
        Album? album = albums[id];
        if album is () {
            return &lt;http:NotFound&gt;{};
        } else {
            return album;
        }
    }

    resource function post albums(@http:Payload Album album) returns Album {
        albums.add(album);
        return album;
    }
}`;

  const grpcCode1 = `import ballerina/grpc;

configurable int port = 9090;

Album[] albums = [
    {id: "1", title: "Blue Train", artist: "John Coltrane", price: 56.99},
    {id: "2", title: "Jeru", artist: "Gerry Mulligan", price: 17.99},
    {id: "3", title: "Sarah Vaughan and Clifford Brown", artist: "Sarah Vaughan", price: 39.99}
];

@grpc:ServiceDescriptor {
    descriptor: ROOT_DESCRIPTOR_RECORD_STORE,
    descMap: getDescriptorMapRecordStore()
}
service "Albums" on new grpc:Listener(port) {
    remote function getAlbum(string id) returns Album|error {
        Album[] filteredAlbums = albums.filter(album =&gt; album.id == id);
        if filteredAlbums.length() &gt; 0 {
            return filteredAlbums.pop();
        }

        return error grpc:NotFoundError(string \`Cannot find the album for ID $\{id\}\`);
    }

    remote function addAlbum(Album album) returns Album|error {
        albums.push(album);
        return album;
    }

    remote function listAlbums() returns stream&lt;Album, error?&gt;|error {
        return albums.toStream();
    }
}`;

  const grpcCode2 = `syntax = "proto3";

import "google/protobuf/wrappers.proto";
import "google/protobuf/empty.proto";

service Albums {
    rpc getAlbum(google.protobuf.StringValue)
            returns (Album);
    rpc addAlbum(Album) returns (Album);
    rpc listAlbums(google.protobuf.Empty)
            returns (stream Album);
}

message Album {
    string id = 1;
    string title = 2;
    string artist = 3;
    float price = 4;
};`;

  const graphqlApi = `import ballerina/graphql;
import ballerina/http;
import ballerinax/mysql;
import ballerinax/mysql.driver as _;

configurable string user = ?;
configurable string password = ?;
configurable string host = ?;
configurable int port = ?;
configurable string database = ?;
configurable string apiEndpoint = ?;

public type Album record {
    string id;
    string title;
    string artist;
    decimal price;
    Currency currency = USD;
};

public enum Currency {
    USD,
    LKR,
    EUR,
    GBP
}

service / on new graphql:Listener(9000) {
    private final mysql:Client db;
    private final http:Client forex;
    private final Currency baseCurrency = USD;

    function init() returns error? {
        self.db = check new (host, user, password, database, port);
        self.forex = check new (apiEndpoint);
    }

    resource function get album(string id, Currency currency = USD) returns Album|error {
        Album album = check self.db->queryRow(\`SELECT * FROM Albums WHERE id=$\{id\}\`);
        if currency != self.baseCurrency {
            string query = string \`from=$\{self.baseCurrency\}&to=$\{currency\}\`;
            record {decimal rate;} exchange = check self.forex->get(string \`/curerncyConversion?$\{query\}\`);
            album.price = album.price * exchange.rate;
            album.currency = currency;
        }
        return album;
    }
}`;

  const kafkaConsumer = `import ballerina/lang.value;
import ballerinax/kafka;

configurable string groupId = "order-consumers";
configurable string orders = "orders";
configurable string paymentSuccessOrders = "payment-success-orders";
configurable decimal pollingInterval = 1;
configurable string kafkaEndpoint = kafka:DEFAULT_URL;

type Order readonly & record {|
    int id;
    string desc;
    PaymentStatus paymentStatus;
|};

enum PaymentStatus {
    SUCCESS,
    FAIL
}

final kafka:ConsumerConfiguration consumerConfigs = {
    groupId: groupId,
    topics: [orders],
    offsetReset: kafka:OFFSET_RESET_EARLIEST,
    pollingInterval: pollingInterval
};

service on new kafka:Listener(kafkaEndpoint, consumerConfigs) {
    private final kafka:Producer orderProducer;

    function init() returns error? {
        self.orderProducer = check new (kafkaEndpoint);
    }

    remote function onConsumerRecord(kafka:ConsumerRecord[] records) returns error? {
        check from kafka:ConsumerRecord {value} in records
            let string orderString = check string:fromBytes(value)
            let Order 'order = check value:fromJsonStringWithType(orderString)
            where 'order.paymentStatus == SUCCESS
            do {
                check self.orderProducer->send({
                    topic: paymentSuccessOrders,
                    value: 'order.toString().toBytes()
                });
            };
    }
}`;

  const workingWithDataBases = `import ballerina/http;
import ballerina/sql;
import ballerinax/mysql;
import ballerinax/mysql.driver as _;

configurable string host = ?;
configurable int port = ?;
configurable string user = ?;
configurable string password = ?;
configurable string database = ?;

type Album record {|
    string id;
    string title;
    string artist;
    decimal price;
|};

service / on new http:Listener(8080) {
    private final mysql:Client db;

    function init() returns error? {
        self.db = check new (host, user, password, database, port);
    }

    resource function get albums() returns Album[]|error? {
        stream&lt;Album, sql:Error?&gt; albumStream = self.db->query(\`SELECT * FROM Albums\`);
        Album[]? albums = check from Album album in albumStream select album;
        check albumStream.close();
        return albums;
    }

    resource function get albums/[string id]() returns Album|http:NotFound|error {
        Album|sql:Error result = self.db->queryRow(\`SELECT * FROM Albums WHERE id = $\{id\}\`);
        if result is sql:NoRowsError {
            return &lt;http:NotFound&gt;{};
        } else {
            return result;
        }
    }

    resource function post album(@http:Payload Album album) returns Album|error {
        _ = check self.db->execute(\`
            INSERT INTO Albums (id, title, artist, price)
            VALUES ($\{album.id\}, $\{album.title\}, $\{album.artist\}, $\{album.price\});\`);
        return album;
    }
}`;


  return (
    <Col sm={12}>
      <Container>
        <Row>
          <Col sm={12} className='sectionTitle'>
            <h2 id="ballerina-in-action">Ballerina in action</h2>
          </Col>
        </Row>

        <Row>
          <Col sm={12}>
            <Tabs
              id="controlled-tab-example"
              activeKey={key}
              onSelect={(k) => setKey(k)}
              className={styles.balActionTabs}
            >

              <Tab eventKey="consuming-services" title="Consuming services">
                <Row>
                  <Col lg={7} md={12} sm={12} className={styles.col1} id="column1" >
                    <div className={styles.focusPane}>
                      <div className="highlight" dangerouslySetInnerHTML={{ __html: HighlightSyntax(ConsumerServices, 'ballerina') }} />
                    </div>
                  </Col>
                  <Col lg={5} md={12} sm={12} className={styles.col2} id="column2" >
                    <div className={styles.focusPane}>
                      <Image src={`${prefix}/images/consuming-services-diagram.svg`} width={433} height={655} alt="consuming-services-diagram" />
                    </div>
                  </Col>
                </Row>
              </Tab>


              <Tab eventKey="working-with-data" title="Working with data">
                <Row>
                  <Col lg={7} md={12} sm={12} className={styles.col1}>
                    <div className={styles.focusPane}>
                      <div className="highlight" dangerouslySetInnerHTML={{ __html: HighlightSyntax(workingWithData, 'ballerina') }} />
                    </div>
                  </Col>
                  <Col lg={5} md={12} sm={12} className={styles.col2}>
                    <div className={styles.focusPane}>
                      <Image src={`${prefix}/images/working-with-data-diagram.svg`} width={433} height={456} alt="working-with-data-diagram" />
                      <a target="_blank" href="https://play.ballerina.io/?gist=30a51792b6b4d46c2cbdfdd424fb3b45&file=play.bal" rel="noreferrer">
                        <button className={styles.playgroundButton} id="simple11" > Try in Playground</button>
                      </a>
                    </div>
                  </Col>
                </Row>
              </Tab>

              <Tab eventKey="restful-api" title="RESTful API">
                <Row>
                  <Col sm={12}>
                    <div className={styles.focusPane}>
                      <div className="highlight" dangerouslySetInnerHTML={{ __html: HighlightSyntax(restfulApi, 'ballerina') }} />
                    </div>
                  </Col>
                </Row>
              </Tab>

              <Tab eventKey="grpc-api" title="gRPC API">
                <Row>
                  <Col lg={7} md={12} sm={7} className={styles.col1}>
                    <div className={styles.focusPane}>
                      <div className="highlight" dangerouslySetInnerHTML={{ __html: HighlightSyntax(grpcCode1, 'ballerina') }} />
                    </div>
                  </Col>
                  <Col lg={5} md={12} sm={12} id="grpc-api-proto" className={styles.col2}>
                    <div className={styles.focusPane}>
                      <div className="highlight" dangerouslySetInnerHTML={{ __html: HighlightSyntax(grpcCode2, 'ballerina') }} />
                    </div>
                  </Col>
                </Row>
              </Tab>

              <Tab eventKey="graphql-api" title="GraphQL API">
                <Row>
                  <Col sm={12}>
                    <div className={styles.focusPane}>
                      <div className="highlight" dangerouslySetInnerHTML={{ __html: HighlightSyntax(graphqlApi, 'ballerina') }} />
                    </div>
                  </Col>
                </Row>
              </Tab>

              <Tab eventKey="kafka-consumer-producer" title="Kafka consumer/producer">
                <Row>
                  <Col sm={12}>
                    <div className={styles.focusPane}>
                      <div className="highlight" dangerouslySetInnerHTML={{ __html: HighlightSyntax(kafkaConsumer, 'ballerina') }} />
                    </div>
                  </Col>
                </Row>
              </Tab>

              <Tab eventKey="working-with-databases" title="Working with databases">
                <Row>
                  <Col sm={12}>
                    <div className={styles.focusPane}>
                      <div className="highlight" dangerouslySetInnerHTML={{ __html: HighlightSyntax(workingWithDataBases, 'ballerina') }} />
                    </div>
                  </Col>
                </Row>
              </Tab>

            </Tabs>

          </Col>
        </Row>
      </Container>
    </Col>
  );
}

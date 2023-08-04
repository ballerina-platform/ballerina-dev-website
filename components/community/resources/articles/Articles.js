/**
 * Copyright (c) 2022, WSO2 LLC (http://www.wso2.com) All Rights Reserved.
 *
 * WSO2 LLC licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import * as React from 'react';
import { Row, Col } from 'react-bootstrap';

import styles from './Articles.module.css';

export default function Articles() {

  return (
    <>
      <Row>
        <Col sm={12} md={5} lg={5} className={styles.fArticles}>
          <h2 className="removeTopMargin">Featured articles</h2>

          <div className={styles.articleInfo}>
            <a target="_blank" rel="noreferrer" href="https://www.infoq.com/articles/ballerina-data-functional-programming/">
              <h4>Data Manipulation with Functional Programming and Queries in Ballerina</h4>
            </a>
            <p> By Yehonathan Sharvit </p>
            <p> 11 Aug 2022</p>
          </div>

          <div className={styles.articleInfo}>
            <a target="_blank" rel="noreferrer" href="https://thenewstack.io/how-mosip-uses-ballerina-websubhub-for-event-driven-integration/">
              <h4>How MOSIP Uses Ballerina WebSubHub for Event-Driven Integration</h4>
            </a>
            <p> By Dakshitha Ratnayake</p>
            <p> 28 June 2022</p>
          </div>

          <div className={`${styles.articleInfo} ${styles.last}`}>
            <a target="_blank" rel="noreferrer" href="https://www.infoq.com/articles/ballerina-fullstack-rest-api/">
              <h4>Ballerina for Full-Stack Developers: a Guide to Creating Backend APIs</h4>
            </a>
            <p> By Imesha Sudasingha</p>
            <p> 14 March 2022</p>
          </div>
        </Col>

        <Col sm={12} md={7} lg={7} className={styles.articles}>
          <h2 className="removeTopMargin">Articles</h2>
          <div className={styles.articleWrapper}>
          
             <div className={styles.articleInfo}>
              <a target="_blank" rel="noreferrer" href="https://www.infoworld.com/article/3688921/ballerina-a-programming-language-for-the-cloud.html">
                <h4>Ballerina: A Programming Language for the Cloud</h4>
              </a>
              <p> By Martin Heller</p>
              <p> 8 March 2023</p>
            </div>
          
             <div className={styles.articleInfo}>
              <a target="_blank" rel="noreferrer" href="https://www.infoq.com/articles/ballerina-data-functional-programming/">
                <h4>Data Manipulation with Functional Programming and Queries in Ballerina</h4>
              </a>
              <p> By Yehonathan Sharvit</p>
              <p> 11 Aug 2022</p>
            </div>

            <div className={styles.articleInfo}>
              <a target="_blank" rel="noreferrer" href="https://www.infoq.com/articles/graphql-ballerina/">
                <h4>Using GraphQL and Ballerina with Multiple Data Sources</h4>
              </a>
              <p> By Anupama Pathirage</p>
              <p> 1 July 2022</p>
            </div>

            <div className={styles.articleInfo}>
              <a target="_blank" rel="noreferrer" href="https://thenewstack.io/how-mosip-uses-ballerina-websubhub-for-event-driven-integration/">
                <h4>How MOSIP Uses Ballerina WebSubHub for Event-Driven Integration</h4>
              </a>
              <p> By Dakshitha Ratnayake</p>
              <p> 28 June 2022</p>
            </div>

            <div className={styles.articleInfo}>
              <a target="_blank" rel="noreferrer" href="https://www.infoq.com/articles/ballerina-data-oriented-language/">
                <h4>Ballerina: A Data-Oriented Programming Language</h4>
              </a>
              <p> By Yehonathan Sharvit</p>
              <p> 10 May 2022</p>
            </div>

            <div className={styles.articleInfo}>
              <a target="_blank" rel="noreferrer" href="https://thenewstack.io/why-should-you-program-with-ballerina">
                <h4>Why Should You Program with Ballerina?</h4>
              </a>
              <p> By Vishva Ahangama</p>
              <p> 21 April 2022</p>
            </div>

            <div className={styles.articleInfo}>
              <a target="_blank" rel="noreferrer" href="https://www.infoq.com/articles/ballerina-fullstack-rest-api/">
                <h4>Ballerina for Full-Stack Developers: A Guide to Creating Backend APIs</h4>
              </a>
              <p> By Imesha Sudasingha</p>
              <p> 14 March 2022</p>
            </div>

            <div className={styles.articleInfo}>
              <a target="_blank" rel="noreferrer" href="https://dzone.com/articles/how-to-use-ballerina-local-repository">
                <h4>How to use Ballerina Local Repository</h4>
              </a>
              <p> By Pramodya Mendis</p>
              <p> 10 Dec 2021</p>
            </div>

            <div className={styles.articleInfo}>
              <a target="_blank" rel="noreferrer" href="https://dzone.com/articles/real-time-stock-data-updates-with-websockets-using"><h4>Real-Time Stock Data Updates with WebSockets Using Ballerina</h4></a>
              <p> By Anupama Pathirage</p>
              <p> 23 Nov 2021</p>
            </div>

            <div className={styles.articleInfo}>
              <a target="_blank" rel="noreferrer" href="https://dzone.com/articles/deploying-ballerina-code-to-cloud"><h4>Deploying Ballerina Code on the Cloud</h4></a>
              <p> By Sumudu Nissanka</p>
              <p> 18 Nov 2021</p>
            </div>

            <div className={styles.articleInfo}>
              <a target="_blank" rel="noreferrer" href="https://dzone.com/articles/proper-openapi-documentation-ballerina-resource-apis"><h4>Proper OpenAPI Documentation for Ballerina Resource APIs </h4></a>
              <p> By Sumudu Nissanka</p>
              <p> 17 Nov 2021</p>
            </div>

            <div className={styles.articleInfo}>
              <a target="_blank" rel="noreferrer" href="https://dzone.com/articles/concurrency-safe-execution-ballerina-isolation"><h4>Concurrency-Safe Execution Using Ballerina Isolation</h4></a>
              <p> By Hinduja Balasubramaniyam</p>
              <p> 7 Nov 2021</p>
            </div>

            <div className={styles.articleInfo}>
              <a target="_blank" rel="noreferrer" href="https://dzone.com/articles/binding-patterns-in-ballerina"><h4>Binding Patterns in Ballerina</h4></a>
              <p> By Suleka Helmini</p>
              <p> 19 Oct 2021</p>
            </div>

            <div className={styles.articleInfo}>
              <a target="_blank" rel="noreferrer" href="https://dzone.com/articles/grpc-compression-support-in-go-java-and-ballerina-1"><h4>gRPC Compression Support in Go, Java, and Ballerina</h4></a>
              <p> By Buddhi Kothalawala</p>
              <p> 13 Oct 2021</p>
            </div>

            <div className={styles.articleInfo}>
              <a target="_blank" rel="noreferrer" href="https://dzone.com/articles/how-to-configure-customize-and-utilize-ballerina-logs"><h4>How to Configure, Customize, and use Ballerina Logs </h4></a>
              <p> By Madhuka Wickramapala</p>
              <p> 9 Oct 2021</p>
            </div>
            <div className={styles.articleInfo}>
              <a target="_blank" rel="noreferrer" href="https://dzone.com/articles/event-driven-apis-with-webhook-and-websub"><h4>Event-Driven APIs with Webhook and WebSub </h4></a>
              <p> By Anupama Pathirage</p>
              <p> 21 Sep 2021</p>
            </div>
            <div className={styles.articleInfo}>
              <a target="_blank" rel="noreferrer" href="https://dzone.com/articles/quickstart-openapi-with-ballerina"><h4>Quickstart OpenAPI with Ballerina </h4></a>
              <p> By Anupama Pathirage</p>
              <p> 16 Sep 2021</p>
            </div>
            <div className={styles.articleInfo}>
              <a target="_blank" rel="noreferrer" href="https://www.infoq.com/articles/ballerina-cloud-native-programming/"><h4>Ballerina Swan Lake: 10 Compelling Language Characteristics for Cloud Native Programming </h4></a>
              <p> By Dakshitha Ratnayake</p>
              <p> 15 Sep 2021</p>
            </div>
            <div className={`${styles.articleInfo} ${styles.last}`}>
              <a target="_blank" rel="noreferrer" href="https://thenewstack.io/grpc-a-deep-dive-into-the-communication-pattern/"><h4>gRPC: A Deep Dive into the Communication Pattern </h4></a>
              <p> By Danesh Kuruppu</p>
              <p> 31 Aug 2021</p>
            </div>
          </div>
        </Col>
      </Row>
    </>

  );
}

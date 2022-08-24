/**
 * Copyright (c) 2022, WSO2 LLC. (http://www.wso2.com) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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
import { Row, Col, Alert, Container } from 'react-bootstrap';
import Image from 'next-image-export-optimizer';

import styles from './Discord.module.css';
import { prefix } from '../../../utils/prefix';


function isEmail(email) {
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regex.test(email);
}

export default function Slack() {

  const emailRef = React.useRef();
  const termsRef = React.useRef();
  const [show, setShow] = React.useState(false);
  const [msg, setMsg] = React.useState('');
  const [variant, setVariant] = React.useState('');

  // const inviteSlackUser = (event) => {
  //   let input = {};
  //   let email = emailRef.current.value;
  //   let terms = termsRef.current.checked;

  //   if (terms) {

  //     if (email == "") {
  //       setShow(true);
  //       setMsg("Please enter your email.");
  //       setVariant('danger');
  //     } else if (!isEmail(email)) {
  //       setShow(true);
  //       setMsg("Please enter a valid email.");
  //       setVariant('danger');
  //     } else {
  //       setShow(true);
  //       setMsg("Processing...");
  //       setVariant('secondary');

  //       AWS.config.region = 'us-east-1';
  //       AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  //         IdentityPoolId: atob('dXMtZWFzdC0xOjhiMGViNzYzLTUwNWEtNGE0NS04ODA1LTNkY2ZlZGQwNDVhMA=='),
  //       });
  //       var lambda = new AWS.Lambda();
  //       var result;

  //       if (email == null || email == '') {
  //         input = {};
  //       } else {
  //         input = {
  //           email: email
  //         };
  //       }

  //       lambda.invoke({
  //         FunctionName: 'slackService',
  //         Payload: JSON.stringify(input)
  //       }, function (err, data) {
  //         if (err) {
  //           result = err;
  //         } else {
  //           result = JSON.parse(data.Payload);
  //         }

  //         if (result.body.ok) {
  //           setShow(true);
  //           setMsg("Thank you for your interest in joining the Ballerina Slack Community. Please check your inbox for an invitation to join Slack.");
  //           setVariant('success');
  //           emailRef.current.value = '';
  //         } else if (result.body.error == "already_in_team") {
  //           setShow(true);
  //           setMsg("This email is already subscribed.");
  //           setVariant('secondary');
  //         } else if (result.body.error == "already_invited") {
  //           setShow(true);
  //           setMsg("This email is already invited.");
  //           setVariant('secondary');
  //         } else {
  //           setShow(true);
  //           setMsg("Something went wrong, please try again.");
  //           setVariant('warning');
  //         }
  //       });
  //     }
  //   } else {
  //     setShow(true);
  //     setMsg("Please agree to the Ballerina data privacy policy");
  //     setVariant('danger');
  //   }

  // }

  return (
    <Col xs={12}>
      <Container>
        <Row>
          <Col xs={12}>
            <h2 id='ballerina-discord-community'>Ballerina Discord community</h2>
          </Col>
        </Row>

        <Row>
          <Col sm={12} md={6} lg={6}>
            <p>
              Our 500+ Discord community includes experienced Ballerina engineers and experts from some of the world&apos;s top companies. Use this space to find answers to your questions, get support or learn how others are using Ballerina.
            </p>
            
            <p className={styles.member}>
              Join the <a href="https://discord.gg/3W4X2KJ6uB" target="_blank" rel="noreferrer" passHref>Discord server</a>
            </p>
          </Col>


          <Col sm={12} md={6} lg={6}>
            <Row className={styles.slackCount}>
              <Col sm={12} md={6} lg={6}>
                <p className={styles.slackNum}>500+</p>
                <p className={styles.slackFoot}>Discord members</p>
              </Col>
              <Col sm={12} md={6} lg={6} className="discordImage">
                <Image src={`${prefix}/images/discord-community.svg`} width={132} height={92} alt="Slack Community" />
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </Col>
  );
}

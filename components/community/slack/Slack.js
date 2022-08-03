import * as React from 'react';
import { Row, Col, Alert, Container } from 'react-bootstrap';
import Image from 'next-image-export-optimizer';

import styles from './Slack.module.css';
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

  const inviteSlackUser = (event) => {
    let email = emailRef.current.value;
    let terms = termsRef.current.checked;

    if (terms) {

      if (email == "") {
        setShow(true);
        setMsg("Please enter your email.");
        setVariant('danger');
      } else if (!isEmail(email)) {
        setShow(true);
        setMsg("Please enter a valid email.");
        setVariant('danger');
      } else {
        setShow(true);
        setMsg("Processing...");
        setVariant('secondary');

        AWS.config.region = 'us-east-1';
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
          IdentityPoolId: atob('dXMtZWFzdC0xOjhiMGViNzYzLTUwNWEtNGE0NS04ODA1LTNkY2ZlZGQwNDVhMA=='),
        });
        var lambda = new AWS.Lambda();
        var result;

        if (email == null || email == '') {
          input = {};
        } else {
          input = {
            email: email
          };
        }

        lambda.invoke({
          FunctionName: 'slackService',
          Payload: JSON.stringify(input)
        }, function (err, data) {
          if (err) {
            result = err;
          } else {
            result = JSON.parse(data.Payload);
          }

          if (result.body.ok) {
            setShow(true);
            setMsg("Thank you for your interest in joining the Ballerina Slack Community. Please check your inbox for an invitation to join Slack.");
            setVariant('success');
            emailRef.current.value = '';
          } else if (result.body.error == "already_in_team") {
            setShow(true);
            setMsg("This email is already subscribed.");
            setVariant('secondary');
          } else if (result.body.error == "already_invited") {
            setShow(true);
            setMsg("This email is already invited.");
            setVariant('secondary');
          } else {
            setShow(true);
            setMsg("Something went wrong, please try again.");
            setVariant('warning');
          }
        });
      }
    } else {
      setShow(true);
      setMsg("Please agree to the Ballerina data privacy policy");
      setVariant('danger');
    }

  }

  return (
    <Col xs={12}>
      <Container>
        <Row>
          <Col xs={12}>
            <h2 id='ballerina-slack-community'>Ballerina Slack community</h2>
          </Col>
        </Row>

        <Row>
          <Col sm={12} md={6} lg={6}>
            <p>
              Our 1000+ Slack community includes experienced Ballerina engineers and experts from some of the world’s top companies. Use this space to find answers to your questions, get support or learn how others are using Ballerina.
            </p>
            <form id="bio-slack-subscribeForm">
              <Row>
                <Col sm={12} md={8} lg={8}>
                  <input type="email" required-field="1" name="email"
                    ref={emailRef}
                    className={styles.formControl} id="slackEmail"
                    aria-describedby="emailHelp" placeholder="Enter your email address *" />

                  <Alert variant={variant} show={show}>
                    {msg}
                  </Alert>

                  <div className={styles.checkboxWrapper}>
                    <input type="checkbox" id="terms" className="checkbox" ref={termsRef} />
                    <label className={styles.checkboxLabel} htmlFor="terms">I agree to the <a href="/privacy-policy" target="_blank" className="getStartLinks">Ballerina data privacy policy</a>.</label>
                  </div>

                </Col>
                <Col sm={12} md={4} lg={4}>
                  <button type="button"
                    className={styles.submitButton}
                    id="slackSubscribeButton"
                    onClick={inviteSlackUser}>Join us</button>
                </Col>
              </Row>
            </form>

            <p className={styles.member}>
              Are you already a member?  <a href="https://ballerina-platform.slack.com/" target="_blank" rel="noreferrer">Go to Slack</a>
            </p>
          </Col>


          <Col sm={12} md={6} lg={6}>
            <Row className={styles.slackCount}>
              <Col sm={12} md={6} lg={6}>
                <p className={styles.slackNum}>1000+</p>
                <p className={styles.slackFoot}>Slack members</p>
              </Col>
              <Col sm={12} md={6} lg={6} className="slackImage">
                <Image src={`${prefix}/images/slack-community.svg`} width={132} height={92} alt="Slack Community" />
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </Col>
  );
}

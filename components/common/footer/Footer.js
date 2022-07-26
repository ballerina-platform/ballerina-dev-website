import * as React from 'react';
import { Container, Row, Stack, Col} from 'react-bootstrap';
import Image from 'next-image-export-optimizer';
import Link from 'next/link';

import { prefix } from '../../../utils/prefix';
import styles from './Footer.module.css';

export default function Footer() {

  return (
    <Stack gap={0} className={styles.stack}>
      <Container className={styles.footer}>
        <Row >
          {/* <Col xs={12} sm={12} md={3} lg={3} className="footerLinks">
            <ul>
                <li><a className="cBioFooterLink" href="/downloads">DOWNLOAD</a></li>
                <li data-toggle="modal" data-target="#reportissues1" data-whatever="@mdo"><a className="cBioFooterLink">REPORT ISSUES</a></li>
                <li><a className="cBioFooterLink" href="https://github.com/ballerina-lang/ballerina/blob/master/LICENSE">CODE LICENSE</a></li>
                <li><a className="cBioFooterLink" href="/license-of-site">SITE LICENSE</a></li>
                <li><a className="cBioFooterLink" href="/terms-of-service">TERMS OF SERVICE</a></li>
                <li><a className="cBioFooterLink" href="/privacy-policy">PRIVACY POLICY</a></li>
                <li><a className="cBioFooterLink" href="/cookie-policy">COOKIE POLICY</a></li>
                <li><a className="cBioFooterLink" href="/security-policy">SECURITY POLICY</a></li>
                <li><a className="cBioFooterLink" href="/trademark-usage-policy/">TRADEMARK USAGE POLICY</a></li>
            </ul>
          </Col> */}
          <Col xs={12} sm={12} md={6} lg={6}>
            <div className={styles.socialMedia}>
              <div className={styles.smIcons}>
                <ul>
                <li><a className={styles.footerLinkSM} href="https://github.com/ballerina-platform" target="_blank" rel="noreferrer" passHref><Image src={`${prefix}/images/github.svg`} width={18} height={18} alt="GitHub"/></a></li>
                <li><a className={styles.footerLinkSM} href="https://twitter.com/ballerinalang" target="_blank" rel="noreferrer" passHref><Image src={`${prefix}/images/twitter.svg`} width={19} height={15} alt="Twitter"/></a></li>
                <li><a className={styles.footerLinkSM} href="https://groups.google.com/g/ballerina-dev" target="_blank" rel="noreferrer" passHref><Image src={`${prefix}/images/google-groups.svg`} width={17} height={17} alt="Google Groups"/></a></li>
                <li><a className={styles.footerLinkSM} href={`/community/#ballerina-slack-community`} target="_blank" rel="noreferrer" passHref><Image src={`${prefix}/images/slack.svg`} width={17} height={17} alt="Slack"/></a></li>
                <li><a className={styles.footerLinkSM} href="https://stackoverflow.com/questions/tagged/ballerina" target="_blank" rel="noreferrer" passHref><Image src={`${prefix}/images/stackoverflow.svg`} width={15} height={18} alt="Stackoverflow"/></a></li>
                <li><a className={styles.footerLinkSM} href="https://www.youtube.com/c/Ballerinalang" target="_blank" rel="noreferrer" passHref><Image src={`${prefix}/images/youtube-icon.svg`} width={15} height={18} alt="Youtube"/></a></li>
                <li><a className={styles.footerLinkSM} href="https://www.linkedin.com/company/79080790" target="_blank" rel="noreferrer" passHref><Image src={`${prefix}/images/linkedin.svg`} width={16} height={16} alt="LinkedIn"/></a></li>
                </ul>
              </div>
              <div className={styles.subscribe}>
                <Link className={styles.subscribeBtn} href={`/community/#subscribe-to-newsletter`}>Subscribe to our newsletter</Link>
              </div>
                
            </div>

            <div className={styles.footerLinks}>
            <ul>
                <li><Link className="footerLink" href={`/downloads`}>DOWNLOAD</Link></li>
                <li><a className="footerLink" target='_blank' rel="noreferrer" href="https://github.com/ballerina-platform/ballerina-lang/issues/new/choose">REPORT ISSUES</a></li>
            </ul>
            </div>

            
          </Col>
          <Col xs={12} sm={10} md={6} lg={6} className={styles.inspire}>
            <p>In the creation of Ballerina, we were inspired by many technologies. Thank you to all that have come before us (and forgive us if we missed one): Java, Go, C, C++, D, Rust, Haskell, Kotlin, Dart, TypeScript, JavaScript, Python, Perl, Flow, Swift, Elm, RelaxNG, NPM, Crates, Maven, Gradle, Kubernetes, Docker, Envoy, Markdown, GitHub, and WSO2.</p>
          </Col>
        </Row>
        <Row className={styles.policyLinks}>
          <Col xs={12}>
            <ul>
              <li><a className="footerLink" target='_blank' rel="noreferrer" href="https://github.com/ballerina-lang/ballerina/blob/master/LICENSE">CODE LICENSE</a></li>
              <li><Link className="footerLink" href={`/license-of-site`}>SITE LICENSE</Link></li>
              <li><Link className="footerLink" href={`/terms-of-service`}>TERMS OF SERVICE</Link></li>
              <li><Link className="footerLink" href={`/privacy-policy`}>PRIVACY POLICY</Link></li>
              <li><Link className="footerLink" href={`/cookie-policy`}>COOKIE POLICY</Link></li>
              <li><Link className="footerLink" href={`/security-policy`}>SECURITY POLICY</Link></li>
              <li><Link className="footerLink" href={`/trademark-usage-policy/`}>TRADEMARK USAGE POLICY</Link></li>
            </ul>
          </Col>
        </Row>
      </Container>
    </Stack>
  );
}
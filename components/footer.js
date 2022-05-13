import * as React from 'react';
import { Container, Row, Stack, Col} from 'react-bootstrap';

export default function Footer() {

  return (
    <Stack gap={0}>
      <Container className='balFooter' fluid>
        <Row >
          <Col xs={12} sm={12} md={3} lg={3} className="footerLinks">
            <ul>
                <li><a className="cBioFooterLink" href="/downloads">DOWNLOAD</a></li>
                {/* <!--<li><a className="cBioFooterLink" href="/community/#report-issues">REPORT ISSUES</a></li>--> */}
                <li data-toggle="modal" data-target="#reportissues1" data-whatever="@mdo"><a className="cBioFooterLink">REPORT ISSUES</a></li>
                <li><a className="cBioFooterLink" href="https://github.com/ballerina-lang/ballerina/blob/master/LICENSE">CODE LICENSE</a></li>
                <li><a className="cBioFooterLink" href="/license-of-site">SITE LICENSE</a></li>
                <li><a className="cBioFooterLink" href="/terms-of-service">TERMS OF SERVICE</a></li>
                <li><a className="cBioFooterLink" href="/privacy-policy">PRIVACY POLICY</a></li>
                <li><a className="cBioFooterLink" href="/cookie-policy">COOKIE POLICY</a></li>
                <li><a className="cBioFooterLink" href="/security-policy">SECURITY POLICY</a></li>
                <li><a className="cBioFooterLink" href="/trademark-usage-policy/">TRADEMARK USAGE POLICY</a></li>
            </ul>
          </Col>
          <Col xs={12} sm={12} md={3} lg={3}>
            <div className="socialMedia">
                <ul>
                    <li>
                        <a className="cBioFooterLink" href="https://github.com/ballerina-platform" target="_blank" rel="noreferrer"><img src="/images/github.svg"/></a>
                        </li>
                    <li><a className="cBioFooterLink" href="https://stackoverflow.com/questions/tagged/ballerina" target="_blank" rel="noreferrer"><img src="/images/stackoverflow.svg"/></a></li>
                    <li><a className="cBioFooterLink" href="https://twitter.com/ballerinalang" target="_blank" rel="noreferrer"><img src="/images/twitter.svg"/></a></li>
                    <li><a className="cBioFooterLink" href="/community/#ballerina-slack-community"><img src="/images/slack.svg"/></a></li>
                    <li><a className="cBioFooterLink" href="https://www.youtube.com/c/Ballerinalang"><img src="/images/youtube-icon.svg" width={15}/></a></li>
                    </ul>
                <div className="pdframe"></div>
                </div>

            <a className="cNLButton" href="/community/#subscribe-to-newsletter">Subscribe to our newsletter</a> 

            <div className="modal fade" id="reportissues1" tabIndex="-1" role="dialog" aria-labelledby="reportissueslabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">×</span>
                        </button>
                    <h3 className="modal-title" >Report issues</h3>
                    <p className="modelDescription" >Report issues in the GitHub repositories of the areas and components listed below.
                    </p>
                    </div>
                    <div className="modal-body" >
                    <ul className="b" >
                        <li><a className="linkText" href="https://github.com/ballerina-platform/ballerina-lang/issues/new/choose" target="_blank" rel="noreferrer"> Compiler, runtime, and CLI tooling</a></li>
                        <li><a className="linkText" href="https://github.com/ballerina-platform/ballerina-standard-library/issues/new/choose" target="_blank" rel="noreferrer"> Standard Library</a></li>
                        <li><a className="linkText" href="https://github.com/wso2/ballerina-plugin-vscode/issues/new/choose" target="_blank" rel="noreferrer"> Ballerina Visual Studio Code extension</a></li>
                        <li><a className="linkText" href="https://github.com/ballerina-platform/ballerina-spec/issues/new/choose" target="_blank" rel="noreferrer">  Platform specifications</a></li>
                        <li><a className="linkText" href="https://github.com/ballerina-platform/ballerina-dev-website/issues/new/choose" target="_blank" rel="noreferrer">  Website, Ballerina Central, API Docs</a></li>
                        <li><a className="linkText" href="mailto:security@ballerina.io" target="_blank" rel="noreferrer">Security</a> <span>(For details, see the</span> <a className="linkText" href="/security" target="_blank" rel="noreferrer">security policy</a>.)</li>
                    </ul>  
                    </div>
                </div>
                </div>
            </div>
          </Col>
          <Col xs={12} sm={10} md={6} lg={6} className='inspire'>
            <p>In the creation of Ballerina, we were inspired by many technologies. Thank you to all that have come before us (and forgive us if we missed one): Java, Go, C, C++, D, Rust, Haskell, Kotlin, Dart, TypeScript, JavaScript, Python, Perl, Flow, Swift, Elm, RelaxNG, NPM, Crates, Maven, Gradle, Kubernetes, Docker, Envoy, Markdown, GitHub, and WSO2.</p>
          </Col>
        </Row>
      </Container>
    </Stack>
  );
}

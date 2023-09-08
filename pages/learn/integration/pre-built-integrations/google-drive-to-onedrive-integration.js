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

import React from "react";
import Head from "next/head";
import { Row, Col, Container, Tab, Tabs } from "react-bootstrap";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FaRegCopy, FaCheck } from 'react-icons/fa';

import Layout from "../../../../layouts/LayoutLearn";
import { prefix } from '../../../../utils/prefix';
import { getHighlighter } from "shiki";
import LightBoxImage from "../../../../components/common/lightbox/LightBoxImage";




export async function getStaticProps() {
  const highlighter = await getHighlighter({
    theme: 'github-light'
  });
  const content = `
import ballerina/log;
import ballerinax/googleapis.drive;
import ballerinax/microsoft.onedrive;

configurable string gDriveAccessToken = ?;
configurable string gDriveFolderId = ?;

configurable string oneDriveAccessToken = ?;
configurable string oneDrivePath = ?;

configurable boolean filesOverridable = ?;

public function main() returns error? {
  
    drive:Client gDriveEndpoint = check new ({auth: {token: gDriveAccessToken}});

    onedrive:Client onedriveEndpoint = check new ({auth: {token: oneDriveAccessToken}});

    string gDriveQuery = string \`'\${gDriveFolderId}' in parents and trashed = false\`;
    stream<drive:File> filesInGDrive = check gDriveEndpoint->getAllFiles(gDriveQuery);

    foreach drive:File file in filesInGDrive {
        string? fileName = file?.name;
        string? fileId = file?.id;
        boolean writable = false;

        if fileName !is string || fileId !is string {
            log:printError("File name or ID not found");
            continue;
        }
        if !filesOverridable {
            boolean|error isExistingFile = checkIfFileExistsInOneDrive(fileName, onedriveEndpoint);
            if isExistingFile is error {
                log:printError("Searching files in Microsoft OneDrive failed!", isExistingFile);
                continue;
            }
            writable = !isExistingFile;
        }
        if filesOverridable || writable {
            drive:FileContent|error fileContent = gDriveEndpoint->getFileContent(fileId);
            if fileContent is error {
                log:printError("Retrieving file from Google Drive failed!", fileContent);
                continue;
            }
            onedrive:DriveItemData|error uploadFileToFolderByPath = onedriveEndpoint->
                    uploadFileToFolderByPath(oneDrivePath, fileName, fileContent?.content,
                    fileContent?.mimeType);
            if uploadFileToFolderByPath is error {
                log:printError("Uploading file to Microsoft OneDrive failed!", uploadFileToFolderByPath);
                continue;
            }
            log:printInfo(string \`File \${fileName} uploaded successfully!\`);
        }
    }
}
  
isolated function checkIfFileExistsInOneDrive(string fileName, onedrive:Client onedriveEndpoint) returns boolean|error {
    stream<onedrive:DriveItemData, onedrive:Error?> searchDriveItems = check onedriveEndpoint->searchDriveItems(
        fileName);
    record {|onedrive:DriveItemData value;|}? next = check searchDriveItems.next();
    return next !is ();
}
`;
  var samples = { code: highlighter.codeToHtml(content.replaceAll('```', '').trim(), { lang: 'ballerina' }) };

  return {
    props: {
      samples,
      content
    },
  };
}

export default function Learn({ samples, content }) {

  // const onInit = () => {
  //   console.log('lightGallery has been initialized');
  // };

  const [copied, setCopied] = React.useState(false);

  const codeCopy = () => {
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  }


  return (
    <>
      <Head>
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="description"
          content="Ballerina is a comprehensive language that is easy to grasp for anyone with prior programming experience. Start learning with the material below."
        />
        <meta name="author" content="WSO2 LLC" />
        <meta
          name="keywords"
          content="ballerina, learn, documentation, docs, programming language"
        />
        <link rel="shortcut icon" href="/img/favicon.ico" />
        <title>Google Drive to OneDrive Integration</title>

        {/* FB */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content="Ballerina - Learn" />
        <meta
          property="og:description"
          content="Ballerina is a comprehensive language that is easy to grasp for anyone with prior programming experience. Start learning with the material below."
        />
        <meta
          property="og:image"
          itemProp="image"
          content="https://ballerina.io/images/ballerina-generic-social-media-image-2023.png"
        />

        {/* LINKED IN */}
        <meta property="og:title" content="Ballerina" />
        <meta
          property="og:image"
          content="https://ballerina.io/images/ballerina-generic-social-media-image-2023.png"
        />
        <meta
          property="og:description"
          itemProp="image"
          content="Ballerina is a comprehensive language that is easy to grasp for anyone with prior programming experience. Start learning with the material below."
        />

        {/* TWITTER */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@ballerinalang" />
        <meta name="twitter:creator" content="@ballerinalang" />
        <meta name="twitter:title" content="Ballerina" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:description"
          content="Ballerina is a comprehensive language that is easy to grasp for anyone with prior programming experience. Start learning with the material below."
        />
        <meta
          name="twitter:image"
          content="https://ballerina.io/images/ballerina-generic-social-media-image-2023.png"
        />
        <meta
          property="twitter:text:description"
          content="Ballerina is a comprehensive language that is easy to grasp for anyone with prior programming experience. Start learning with the material below."
        />
        <meta
          property="twitter:image"
          content="https://ballerina.io/images/ballerina-generic-social-media-image-2023.png"
        />
      </Head>

      <Layout>

        <Col sm={12}>
          <Row className="pageHeader pageContentRow llanding">

            <Col xs={12}>
              <Container>
                <h1>Google Drive to OneDrive Integration</h1>
              </Container>
            </Col>


          </Row>

          <Row className="pageContentRow llanding">

            <Col xs={12}>
              <Container>
                <Row>
                  <Col xs={12} lg={6} style={{ fontSize: "18px" }}>
                    <p>In an increasingly interconnected digital landscape, individuals and businesses often use
                      multiple cloud storage services to cater to diverse needs. Synchronizing data across such
                      storages is essential for ensuring that all interested parties access the latest versions of relevant data.</p>

                    <p>The code sample below illustrates how to sync OneDrive and Google Drive files using Ballerina integrations.
                    </p>

                  </Col>
                  <Col xs={12} lg={6} className="text-center">

                    {/* Use when there is an image from README */}

                     <img src={`${prefix}/images/pre-built/flow_diagrams/google-drive-to-onedrive-integration.png`} alt="Position Ballerina" style={{ width: "-webkit-fill-available" }} />

                    {/* Use when there is no image from README and to show the diagram */}

                    {/*<LightBoxImage*/}
                    {/*  thumbnail={`${prefix}/images/pre-built/sample2-thumb.png`}*/}
                    {/*  diagram={`${prefix}/images/gmail-diagram.png`} />*/}



                  </Col>
                </Row>

              </Container>
            </Col>
          </Row>

          <Row className="pageContentRow llanding" >
            <Col xs={12}>
              <Container>

                {/* Use the following section if there the diagram shown above */}

                {/* <div style={{
                      background: "#eeeeee", padding: "10px",
                      borderRadius: "5px",
                      marginTop: "20px",
                      backgroundColor: "#eeeeee !important"
                    }}>
                      <CopyToClipboard text={content}
                        onCopy={() => codeCopy()} style={{ float: "right" }}>
                        {
                          copied ? <FaCheck style={{ color: "20b6b0" }} title="Copied" /> : <FaRegCopy title="Copy" />
                        }
                      </CopyToClipboard>

                      <div className="highlight" dangerouslySetInnerHTML={{ __html: samples.code }} />
                    </div> */}


                {/* Use tabs if there the diagram is not shown above */}
                <Tabs className="mb-3 preBuilt">
                  <Tab eventKey="code" title="Code">
                    <div style={{
                      background: "#eeeeee", padding: "10px",
                      borderRadius: "5px",
                      marginTop: "20px",
                      backgroundColor: "#eeeeee !important"
                    }}>
                      <CopyToClipboard text={content}
                        onCopy={() => codeCopy()} style={{ float: "right" }}>
                        {
                          copied ? <FaCheck style={{ color: "20b6b0" }} title="Copied" /> : <FaRegCopy title="Copy" />
                        }
                      </CopyToClipboard>

                      <div className="highlight" dangerouslySetInnerHTML={{ __html: samples.code }} />
                    </div>
                  </Tab>
                  <Tab eventKey="diagram" title="Diagram">

                    <Col xs={12} lg={6} className="text-center">
                      <LightBoxImage
                        thumbnail={`${prefix}/images/pre-built/sequence-diagrams/google-drive-to-onedrive-integration_cropped.png`}
                        diagram={`${prefix}/images/pre-built/sequence-diagrams/google-drive-to-onedrive-integration.png`} />

                    </Col>

                  </Tab>
                </Tabs>

              </Container>
            </Col>
          </Row>

        </Col>


      </Layout>
    </>
  );
}

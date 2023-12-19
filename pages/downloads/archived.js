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

import React from 'react';
import { Row, Col, Button, Offcanvas, Container } from 'react-bootstrap';
import Image from 'next-image-export-optimizer';
import Head from 'next/head';
import dynamic from 'next/dynamic';

import Layout from '../../layouts/LayoutRN';
import { prefix } from '../../utils/prefix';
import archive from '../../_data/release_notes_versions.json';
import SLArchive from '../../_data/swanlake_release_notes_versions.json';
import archivedToc from '../../utils/archived-lm.json';


export default function AllArchived() {

    const LeftNav = dynamic(() => import('../../components/common/left-nav/LeftNav'), { ssr: false });

    function comparePositions(a, b) {
        return (b['release-date'] > a['release-date']) ? 1 : ((b['release-date'] < a['release-date']) ? -1 : 0)
    }

    let release12x = [];
    let release11x = [];
    let release10x = [];
    let release09x = [];

    const splitArray = (value) => {
        if (value.version.match(/^1.2/)) {
            release12x.push(value);
        } else if (value.version.match(/^1.1/)) {
            release11x.push(value);
        } else if (value.version.match(/^1.0/)) {
            release10x.push(value);
        } else {
            release09x.push(value);
        }
    }

    archive.map(splitArray)

    const sortedRelease12x = release12x.sort(comparePositions);
    const sortedRelease11x = release11x.sort(comparePositions);
    const sortedRelease10x = release10x.sort(comparePositions);
    const sortedRelease09x = release09x.sort(comparePositions);

    // Show mobile left nav
    const [show, setShow] = React.useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // Control Left nav
    const [mainDir, setMainDir] = React.useState('swan-lake-archived-versions');
    const [id, setId] = React.useState('');

    const setLeftNav = (hash) => {

        if (hash.match(/^1.2./)) {
            setMainDir('1.2.x-archived-versions');
            setId(hash + 'v');
        } else if (hash.match(/^1.1./)) {
            setMainDir('1.1.x-archived-versions');
            setId(hash + 'v');
        } else if (hash.match(/^1.0./)) {
            setMainDir('1.0.x-archived-versions');
            setId(hash + 'v');
        } else if (hash.match(/^0.9/)) {
            setMainDir('0.9.x-archived-versions');
            setId(hash + 'v');
        } else {
            setMainDir('swan-lake-archived-versions');
            setId(hash + 'v');
        }
    }

    React.useEffect(() => {
        let hash = global.location.hash;
        hash = hash.replace(/#/g, '');
        setLeftNav(hash)
    })

    React.useEffect(() => {
        window.addEventListener('hashchange', function () {
            let hash = global.location.hash;
            hash = hash.replace(/#/g, '');
            setLeftNav(hash)
        }, false);
    })

    const [releases, setReleases] = React.useState(SLArchive)
    React.useEffect(() => setReleases(SLArchive.reverse()), [])

    return (
        <>
            <Head>

                <meta name="description" content="Archived Ballerina distribution versions" />
                <meta name="author" content="WSO2 LLC." />

                <meta name="keywords" content="ballerina, ballerina downloads, release notes, getting started, programming language" />

                <title>Archived versions - The Ballerina programming language</title>

                {/* <!--FB--> */}
                <meta property="og:type" content="website" />
                <meta property="og:title" content="Archived versions - The Ballerina programming language" />
                <meta property="og:description" content="Archived Ballerina distribution versions" />

                {/* <!--LINKED IN  --> */}
                <meta property="og:description" content="Archived Ballerina distribution versions" />

                {/* <!--TWITTER--> */}
                <meta name="twitter:title" content="Archived versions - The Ballerina programming language" />
                <meta name="twitter:description" content="Archived Ballerina distribution versions" />
                <meta name="twitter:text:description" content="Archived Ballerina distribution versions" />
            </Head>
            <Layout>
                <Col sm={3} xxl={2} className='leftNav d-none d-sm-block'>
                    <LeftNav launcher='archived' id={id}
                        mainDir={mainDir}
                        Toc={archivedToc} />
                </Col>
                <Col xs={12} className='d-block d-sm-none'>
                    <Button className='learnMob' onClick={handleShow}>
                        Archived Versions
                    </Button>
                    <Offcanvas show={show} onHide={handleClose}>
                        <Offcanvas.Header closeButton>
                        </Offcanvas.Header>
                        <Offcanvas.Body>
                            <LeftNav launcher='archived' id={id}
                                mainDir={mainDir}
                                Toc={archivedToc} />
                        </Offcanvas.Body>
                    </Offcanvas>
                </Col>
                <Col xs={12} sm={9} xxl={10} className='archiveContent'>
                    <Container>
                        <Row className="cDownloadsHeader pageHeader pageContentRow">
                            <Col xs={12}>
                                <h1>Archived versions</h1>
                            </Col>
                        </Row>


                        <Row className="pageHeader pageContentRow">
                            <Col xs={12}>
                                <Row className='archivedCategory'>
                                    <h2 id='swan-lake-archived-versions'>Swan Lake archived versions</h2>

                                    {releases.map((item, index) => (
                                        <div className="installers" key={item.version}>
                                            <h3 className="releaseVersion" id={item.version}>{item.version} ({item['release-date']})</h3>
                                            <Row className="releasesRow">
                                                <Col xs={12} className="leftTable">
                                                    <table>
                                                        <tbody>
                                                            <tr>
                                                                <td style={{ width: "60%" }}>{item['linux-installer']}</td>
                                                                <td style={{ width: "10%" }}>
                                                                    <a href={`${process.env.distServer}/downloads/${item.version}/${item['linux-installer']}`}
                                                                        name={item['linux-installer']} data-pack={item['linux-installer']} target="">
                                                                        <Image src={`${prefix}/images/download-bg-green-fill.svg`} width={13} height={13} alt={item['linux-installer']} />
                                                                    </a>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td >{item['windows-installer']}</td>
                                                                <td><a href={`${process.env.distServer}/downloads/${item.version}/${item['windows-installer']}`}
                                                                    name={item['windows-installer']} data-pack={item['windows-installer']} target="">
                                                                    <Image src={`${prefix}/images/download-bg-green-fill.svg`} width={13} height={13} alt={item['windows-installer']} />
                                                                </a>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>{item['macos-installer']}</td>
                                                                <td><a href={`${process.env.distServer}/downloads/${item.version}/${item['macos-installer']}`}
                                                                    name={item['macos-installer']} data-pack={item['macos-installer']} target="">
                                                                    <Image src={`${prefix}/images/download-bg-green-fill.svg`} width={13} height={13} alt={item['macos-installer']} />
                                                                </a>
                                                                </td>
                                                            </tr>
                                                            {
                                                                item['macos-arm-installer'] &&

                                                                <tr>
                                                                    <td>{item['macos-arm-installer']}</td>
                                                                    <td><a href={`${process.env.distServer}/downloads/${item.version}/${item['macos-arm-installer']}`}
                                                                        name={item['macos-arm-installer']} data-pack={item['macos-arm-installer']} target="">
                                                                        <Image src={`${prefix}/images/download-bg-green-fill.svg`} width={13} height={13} alt={item['macos-arm-installer']} />
                                                                    </a>
                                                                    </td>
                                                                </tr>
                                                            }

                                                            {
                                                                item['other-artefacts'].map((ot, index) => (
                                                                    <tr key={ot}>
                                                                        <td >{ot}</td>
                                                                        <td><a href={`${process.env.distServer}/downloads/${item.version}/${ot}`}
                                                                            name={ot} data-pack={ot} target="">
                                                                            <Image src={`${prefix}/images/download-bg-green-fill.svg`} width={13} height={13} alt={ot} />
                                                                        </a>
                                                                        </td>
                                                                    </tr>
                                                                ))
                                                            }
                                                        </tbody>
                                                    </table>
                                                </Col>
                                            </Row>
                                            {
                                                (item.version.indexOf('swan') > -1) ?
                                                    <div className="archivedReleaseNotes">
                                                        <a className="archivedReleaseNotesLink" id={`${item.version} notes`} href={`${prefix}/downloads/swan-lake-release-notes/${item.version}`}>RELEASE NOTES</a>
                                                    </div>
                                                    : <div className="archivedReleaseNotes">
                                                        <a className="archivedReleaseNotesLink" id={`${item.version} notes`} href={`${prefix}/downloads/swan-lake-release-notes/swan-lake-${item.version}`}>RELEASE NOTES</a>
                                                    </div>

                                            }
                                        </div>
                                    ))}
                                </Row>

                                <Row className='archivedCategory'>
                                    <div className='catTitleRow'>
                                        <h2 id='1.2.x-archived-versions'>1.2.x archived versions</h2>
                                        </div>
                                        <div className='archivedNote'>
                                        <p>You can download the Visual Studio Code extension for Ballerina 1.2.x versions, from the <a target="_blank" rel="noreferrer" className="archivedReleaseNotesLink" href="https://marketplace.visualstudio.com/items?itemName=ballerina.ballerina">VS Code marketplace.</a></p>
                                        </div>
                                    {sortedRelease12x.map((item, index) => (

                                        <div className="installers" key={item.version}>
                                            <h3 className="releaseVersion" id={item.version}>{item.version} ({item['release-date']})</h3>
                                            <Row className="releasesRow">
                                                <Col xs={12} className="leftTable">
                                                    <table>
                                                        <tbody>
                                                            <tr>
                                                                <td >{item['linux-installer']}</td>
                                                                <td><a href={`${process.env.distServer}/downloads/${item.version}/${item['linux-installer']}`}
                                                                    name={item['linux-installer']} data-pack={item['linux-installer']} target="">
                                                                    <Image src={`${prefix}/images/download-bg-green-fill.svg`} width={13} height={13} alt={item['linux-installer']} />
                                                                </a>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td >{item['windows-installer']}</td>
                                                                <td><a href={`${process.env.distServer}/downloads/${item.version}/${item['windows-installer']}`}
                                                                    name={item['windows-installer']} data-pack={item['windows-installer']} target="">
                                                                    <Image src={`${prefix}/images/download-bg-green-fill.svg`} width={13} height={13} alt={item['windows-installer']} />
                                                                </a>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td >{item['macos-installer']}</td>
                                                                <td><a href={`${process.env.distServer}/downloads/${item.version}/${item['macos-installer']}`}
                                                                    name={item['macos-installer']} data-pack={item['macos-installer']} target="">
                                                                    <Image src={`${prefix}/images/download-bg-green-fill.svg`} width={13} height={13} alt={item['macos-installer']} />
                                                                </a>
                                                                </td>
                                                            </tr>

                                                            {
                                                                item['other-artefacts'].map((ot, index) => (
                                                                    <tr key={ot}>
                                                                        <td >{ot}</td>
                                                                        <td><a href={`${process.env.distServer}/downloads/${item.version}/${ot}`}
                                                                            name={ot} data-pack={ot} target="">
                                                                            <Image src={`${prefix}/images/download-bg-green-fill.svg`} width={13} height={13} alt={ot} />
                                                                        </a>
                                                                        </td>
                                                                    </tr>
                                                                ))
                                                            }
                                                        </tbody>
                                                    </table>
                                                </Col>
                                            </Row>
                                            <div className="archivedReleaseNotes">
                                                <a className="archivedReleaseNotesLink" id={`${item.version}notes`} href={`${prefix}/downloads/1.2.x-release-notes/${item.version}`}>RELEASE NOTES</a>
                                            </div>
                                        </div>
                                    ))}
                                </Row>


                                <Row className='archivedCategory'>
                                    <div className='catTitleRow'>
                                        <h2 id='1.1.x-archived-versions'>1.1.x archived versions</h2>
                                    </div>


                                    {sortedRelease11x.map((item, index) => (

                                        <div className="installers" key={item.version}>
                                            <h3 className="releaseVersion" id={item.version}>{item.version} ({item['release-date']})</h3>
                                            <Row className="releasesRow">
                                                <Col xs={12} className="leftTable">
                                                    <table>
                                                        <tbody>
                                                            <tr>
                                                                <td >{item['linux-installer']}</td>
                                                                <td><a href={`${process.env.distServer}/downloads/${item.version}/${item['linux-installer']}`}
                                                                    name={item['linux-installer']} data-pack={item['linux-installer']} target="">
                                                                    <Image src={`${prefix}/images/download-bg-green-fill.svg`} width={13} height={13} alt={item['linux-installer']} />
                                                                </a>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td >{item['windows-installer']}</td>
                                                                <td><a href={`${process.env.distServer}/downloads/${item.version}/${item['windows-installer']}`}
                                                                    name={item['windows-installer']} data-pack={item['windows-installer']} target="">
                                                                    <Image src={`${prefix}/images/download-bg-green-fill.svg`} width={13} height={13} alt={item['windows-installer']} />
                                                                </a>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td >{item['macos-installer']}</td>
                                                                <td><a href={`${process.env.distServer}/downloads/${item.version}/${item['macos-installer']}`}
                                                                    name={item['macos-installer']} data-pack={item['macos-installer']} target="">
                                                                    <Image src={`${prefix}/images/download-bg-green-fill.svg`} width={13} height={13} alt={item['macos-installer']} />
                                                                </a>
                                                                </td>
                                                            </tr>
                                                            {
                                                                item['other-artefacts'].map((ot, index) => (
                                                                    <tr key={ot}>
                                                                        <td >{ot}</td>
                                                                        <td><a href={`${process.env.distServer}/downloads/${item.version}/${ot}`}
                                                                            name={ot} data-pack={ot} target="">
                                                                            <Image src={`${prefix}/images/download-bg-green-fill.svg`} width={13} height={13} alt={ot} />
                                                                        </a>
                                                                        </td>
                                                                    </tr>
                                                                ))
                                                            }
                                                        </tbody>
                                                    </table>
                                                </Col>
                                            </Row>
                                            <div className="archivedReleaseNotes">
                                                <a className="archivedReleaseNotesLink" id={`${item.version}notes`} href={`${prefix}/downloads/1.1.x-release-notes/${item.version}`}>RELEASE NOTES</a>
                                            </div>
                                        </div>
                                    ))}
                                </Row>


                                <Row className='archivedCategory'>
                                    <div className='catTitleRow'>
                                        <h2 id='1.0.x-archived-versions'>1.0.x archived versions</h2>
                                    </div>

                                    {sortedRelease10x.map((item, index) => (

                                        <div className="installers" key={item.version}>
                                            <h3 className="releaseVersion" id={item.version}>{item.version} ({item['release-date']})</h3>
                                            <Row className="releasesRow">
                                                <Col xs={12} className="leftTable">
                                                    <table>
                                                        <tbody>
                                                            <tr>
                                                                <td >{item['linux-installer']}</td>
                                                                <td><a href={`${process.env.distServer}/downloads/${item.version}/${item['linux-installer']}`}
                                                                    name={item['linux-installer']} data-pack={item['linux-installer']} target="">
                                                                    <Image src={`${prefix}/images/download-bg-green-fill.svg`} width={13} height={13} alt={item['linux-installer']} />
                                                                </a>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td >{item['windows-installer']}</td>
                                                                <td><a href={`${process.env.distServer}/downloads/${item.version}/${item['windows-installer']}`}
                                                                    name={item['windows-installer']} data-pack={item['windows-installer']} target="">
                                                                    <Image src={`${prefix}/images/download-bg-green-fill.svg`} width={13} height={13} alt={item['windows-installer']} />
                                                                </a>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td >{item['macos-installer']}</td>
                                                                <td><a href={`${process.env.distServer}/downloads/${item.version}/${item['macos-installer']}`}
                                                                    name={item['macos-installer']} data-pack={item['macos-installer']} target="">
                                                                    <Image src={`${prefix}/images/download-bg-green-fill.svg`} width={13} height={13} alt={item['macos-installer']} />
                                                                </a>
                                                                </td>
                                                            </tr>

                                                            {
                                                                item['other-artefacts'].map((ot, index) => (
                                                                    <tr key={ot}>
                                                                        <td >{ot}</td>
                                                                        <td><a href={`${process.env.distServer}/downloads/${item.version}/${ot}`}
                                                                            name={ot} data-pack={ot} target="">
                                                                            <Image src={`${prefix}/images/download-bg-green-fill.svg`} width={13} height={13} alt={ot} />
                                                                        </a>
                                                                        </td>
                                                                    </tr>
                                                                ))
                                                            }
                                                        </tbody>
                                                    </table>
                                                </Col>
                                            </Row>
                                            <div className="archivedReleaseNotes">
                                                <a className="archivedReleaseNotesLink" id={`${item.version}notes`} href={`${prefix}/downloads/1.0.x-release-notes/${item.version}`}>RELEASE NOTES</a>
                                            </div>
                                        </div>
                                    ))}
                                </Row>


                                <Row>
                                    <div className='catTitleRow'>
                                        <h2 id='0.9.x-archived-versions'>0.9.x archived versions</h2>
                                    </div>

                                    {sortedRelease09x.map((item, index) => (

                                        <div className="installers" key={item.version}>
                                            <h3 className="releaseVersion" id={item.version}>{item.version} ({item['release-date']})</h3>
                                            <Row className="releasesRow">
                                                <Col xs={12} className="leftTable">
                                                    <table>
                                                        <tbody>
                                                            <tr>
                                                                <td >{item['linux-installer']}</td>
                                                                <td><a href={`${process.env.distServer}/downloads/${item.version}/${item['linux-installer']}`}
                                                                    name={item['linux-installer']} data-pack={item['linux-installer']} target="">
                                                                    <Image src={`${prefix}/images/download-bg-green-fill.svg`} width={13} height={13} alt={item['linux-installer']} />
                                                                </a>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td >{item['windows-installer']}</td>
                                                                <td><a href={`${process.env.distServer}/downloads/${item.version}/${item['windows-installer']}`}
                                                                    name={item['windows-installer']} data-pack={item['windows-installer']} target="">
                                                                    <Image src={`${prefix}/images/download-bg-green-fill.svg`} width={13} height={13} alt={item['windows-installer']} />
                                                                </a>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td >{item['macos-installer']}</td>
                                                                <td><a href={`${process.env.distServer}/downloads/${item.version}/${item['macos-installer']}`}
                                                                    name={item['macos-installer']} data-pack={item['macos-installer']} target="">
                                                                    <Image src={`${prefix}/images/download-bg-green-fill.svg`} width={13} height={13} alt={item['macos-installer']} />
                                                                </a>
                                                                </td>
                                                            </tr>

                                                            {
                                                                item['other-artefacts'].map((ot, index) => (
                                                                    <tr key={ot}>
                                                                        <td >{ot}</td>
                                                                        <td><a href={`${process.env.distServer}/downloads/${item.version}/${ot}`}
                                                                            name={ot} data-pack={ot} target="">
                                                                            <Image src={`${prefix}/images/download-bg-green-fill.svg`} width={13} height={13} alt={ot} />
                                                                        </a>
                                                                        </td>
                                                                    </tr>
                                                                ))
                                                            }
                                                        </tbody>
                                                    </table>
                                                </Col>
                                            </Row>
                                            {
                                                (item.version === '0.990.7' || item.version === '0.990.5') ?
                                                    null
                                                    : <div className="archivedReleaseNotes">
                                                        <a className="archivedReleaseNotesLink" id={`${item.version}notes`} href={`${prefix}/downloads/0.9.x-release-notes/${item.version}`}>RELEASE NOTES</a>
                                                    </div>
                                            }

                                        </div>
                                    ))}
                                </Row>
                            </Col>
                        </Row>
                    </Container>
                </Col>
            </Layout>
        </>
    );
}
import React from 'react';
import { Row, Col } from 'react-bootstrap';
import Image from 'next-image-export-optimizer';

import Layout from '../../layouts/LayoutDownloads';
import { prefix } from '../../utils/prefix';
import archive from '../../_data/release_notes_versions.json';


export default function AllArchived() {

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

    return (
        <Layout>

            <Col sm={12}>

                <Row className="cDownloadsHeader pageHeader pageContentRow">
                    <Col xs={12}>
                        <h1>Archived Versions</h1>
                    </Col>
                </Row>

                <Row classNameName="pageHeader pageContentRow">
                    <Col xs={12}>
                        <Row className='archivedCategory'>
                            <h2 id='1.2.x-archived-versions'>1.2.x archived versions</h2>
                            {sortedRelease12x.map((item, index) => (

                                <div className="installers" key={item.version}>
                                    <h3 className="releaseVersion" id={item.version}>{item.version} ({item['release-date']})</h3>
                                    <Row className="releasesRow">
                                        <Col xs={12} md={6} lg={6} className="leftTable">
                                            <table>
                                                <tbody>
                                                    <tr>
                                                        <td >{item['linux-installer']}</td>
                                                        <td><a href={`${process.env.distServer}/downloads/${item.version}/${item['linux-installer']}`}
                                                            name={item['linux-installer']} data-pack={item['linux-installer']} target="">
                                                            <Image src={`${prefix}/images/download-bg-green-fill.svg`} width={13} height={13} alt={item['linux-installer']} />
                                                        </a>
                                                        </td>
                                                        <td><a href={`${process.env.distServer}/downloads/${item.version}/${item['linux-installer']}.md5`}>md5</a></td>
                                                        <td><a href={`${process.env.distServer}/downloads/${item.version}/${item['linux-installer']}.sha1`}>SHA-1</a></td>
                                                        <td><a href={`${process.env.distServer}/downloads/${item.version}/${item['linux-installer']}.asc`}>asc</a></td>
                                                    </tr>
                                                    <tr>
                                                        <td >{item['windows-installer']}</td>
                                                        <td><a href={`${process.env.distServer}/downloads/${item.version}/${item['windows-installer']}`}
                                                            name={item['windows-installer']} data-pack={item['windows-installer']} target="">
                                                            <Image src={`${prefix}/images/download-bg-green-fill.svg`} width={13} height={13} alt={item['windows-installer']} />
                                                        </a>
                                                        </td>
                                                        <td><a href={`${process.env.distServer}/downloads/${item.version}/${item['windows-installer']}.md5`}>md5</a></td>
                                                        <td><a href={`${process.env.distServer}/downloads/${item.version}/${item['windows-installer']}.sha1`}>SHA-1</a></td>
                                                        <td><a href={`${process.env.distServer}/downloads/${item.version}/${item['windows-installer']}.asc`}>asc</a></td>
                                                    </tr>

                                                    {
                                                        (item['other-artefacts'].length > 1) ?
                                                            <tr>
                                                                <td >{item['macos-installer']}</td>
                                                                <td><a href={`${process.env.distServer}/downloads/${item.version}/${item['macos-installer']}`}
                                                                    name={item['macos-installer']} data-pack={item['macos-installer']} target="">
                                                                    <Image src={`${prefix}/images/download-bg-green-fill.svg`} width={13} height={13} alt={item['macos-installer']} />
                                                                </a>
                                                                </td>
                                                                <td><a href={`${process.env.distServer}/downloads/${item.version}/${item['macos-installer']}.md5`}>md5</a></td>
                                                                <td><a href={`${process.env.distServer}/downloads/${item.version}/${item['macos-installer']}.sha1`}>SHA-1</a></td>
                                                                <td><a href={`${process.env.distServer}/downloads/${item.version}/${item['macos-installer']}.asc`}>asc</a></td>
                                                            </tr>
                                                            : null

                                                    }
                                                </tbody>
                                            </table>

                                        </Col>
                                        <Col xs={12} md={6} lg={6} className="rightTable">
                                            <table>
                                                <tbody>
                                                    {
                                                        (item['other-artefacts'].length <= 1) ?
                                                            <tr>
                                                                <td >{item['macos-installer']}</td>
                                                                <td><a href={`${process.env.distServer}/downloads/${item.version}/${item['macos-installer']}`}
                                                                    name={item['macos-installer']} data-pack={item['macos-installer']} target="">
                                                                    <Image src={`${prefix}/images/download-bg-green-fill.svg`} width={13} height={13} alt={item['macos-installer']} />
                                                                </a>
                                                                </td>
                                                                <td><a href={`${process.env.distServer}/downloads/${item.version}/${item['macos-installer']}.md5`}>md5</a></td>
                                                                <td><a href={`${process.env.distServer}/downloads/${item.version}/${item['macos-installer']}.sha1`}>SHA-1</a></td>
                                                                <td><a href={`${process.env.distServer}/downloads/${item.version}/${item['macos-installer']}.asc`}>asc</a></td>
                                                            </tr>
                                                            : null
                                                    }

                                                    {
                                                        (item['other-artefacts'].length > 1) ?
                                                            item['other-artefacts'].map((ot, index) => (
                                                                <tr key={ot}>
                                                                    <td >{ot}</td>
                                                                    <td><a href={`${process.env.distServer}/downloads/${item.version}/${ot}`}
                                                                        name={ot} data-pack={ot} target="">
                                                                        <Image src={`${prefix}/images/download-bg-green-fill.svg`} width={13} height={13} alt={ot} />
                                                                    </a>
                                                                    </td>
                                                                    <td><a href={`${process.env.distServer}/downloads/${item.version}/${ot}.md5`}>md5</a></td>
                                                                    <td><a href={`${process.env.distServer}/downloads/${item.version}/${ot}.sha1`}>SHA-1</a></td>
                                                                    <td><a href={`${process.env.distServer}/downloads/${item.version}/${ot}.asc`}>asc</a></td>
                                                                </tr>
                                                            ))
                                                            :
                                                            <tr>
                                                                <td >{item['other-artefacts']}</td>
                                                                <td><a href={`${process.env.distServer}/downloads/${item.version}/${item['other-artefacts']}`}
                                                                    name={item['other-artefacts']} data-pack={item['other-artefacts']} target="">
                                                                    <Image src={`${prefix}/images/download-bg-green-fill.svg`} width={13} height={13} alt={item['other-artefacts']} />
                                                                </a>
                                                                </td>
                                                                <td><a href={`${process.env.distServer}/downloads/${item.version}/${item['other-artefacts']}.md5`}>md5</a></td>
                                                                <td><a href={`${process.env.distServer}/downloads/${item.version}/${item['other-artefacts']}.sha1`}>SHA-1</a></td>
                                                                <td><a href={`${process.env.distServer}/downloads/${item.version}/${item['other-artefacts']}.asc`}>asc</a></td>
                                                            </tr>

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
                            <h2 id='1.1.x-archived-versions'>1.1.x archived versions</h2>
                            {sortedRelease11x.map((item, index) => (

                                <div className="installers" key={item.version}>
                                    <h3 className="releaseVersion" id={item.version}>{item.version} ({item['release-date']})</h3>
                                    <Row className="releasesRow">
                                        <Col xs={12} md={6} lg={6} className="leftTable">
                                            <table>
                                                <tbody>
                                                    <tr>
                                                        <td >{item['linux-installer']}</td>
                                                        <td><a href={`${process.env.distServer}/downloads/${item.version}/${item['linux-installer']}`}
                                                            name={item['linux-installer']} data-pack={item['linux-installer']} target="">
                                                            <Image src={`${prefix}/images/download-bg-green-fill.svg`} width={13} height={13} alt={item['linux-installer']} />
                                                        </a>
                                                        </td>
                                                        <td><a href={`${process.env.distServer}/downloads/${item.version}/${item['linux-installer']}.md5`}>md5</a></td>
                                                        <td><a href={`${process.env.distServer}/downloads/${item.version}/${item['linux-installer']}.sha1`}>SHA-1</a></td>
                                                        <td><a href={`${process.env.distServer}/downloads/${item.version}/${item['linux-installer']}.asc`}>asc</a></td>
                                                    </tr>
                                                    <tr>
                                                        <td >{item['windows-installer']}</td>
                                                        <td><a href={`${process.env.distServer}/downloads/${item.version}/${item['windows-installer']}`}
                                                            name={item['windows-installer']} data-pack={item['windows-installer']} target="">
                                                            <Image src={`${prefix}/images/download-bg-green-fill.svg`} width={13} height={13} alt={item['windows-installer']} />
                                                        </a>
                                                        </td>
                                                        <td><a href={`${process.env.distServer}/downloads/${item.version}/${item['windows-installer']}.md5`}>md5</a></td>
                                                        <td><a href={`${process.env.distServer}/downloads/${item.version}/${item['windows-installer']}.sha1`}>SHA-1</a></td>
                                                        <td><a href={`${process.env.distServer}/downloads/${item.version}/${item['windows-installer']}.asc`}>asc</a></td>
                                                    </tr>

                                                    {
                                                        (item['other-artefacts'].length > 1) ?
                                                            <tr>
                                                                <td >{item['macos-installer']}</td>
                                                                <td><a href={`${process.env.distServer}/downloads/${item.version}/${item['macos-installer']}`}
                                                                    name={item['macos-installer']} data-pack={item['macos-installer']} target="">
                                                                    <Image src={`${prefix}/images/download-bg-green-fill.svg`} width={13} height={13} alt={item['macos-installer']} />
                                                                </a>
                                                                </td>
                                                                <td><a href={`${process.env.distServer}/downloads/${item.version}/${item['macos-installer']}.md5`}>md5</a></td>
                                                                <td><a href={`${process.env.distServer}/downloads/${item.version}/${item['macos-installer']}.sha1`}>SHA-1</a></td>
                                                                <td><a href={`${process.env.distServer}/downloads/${item.version}/${item['macos-installer']}.asc`}>asc</a></td>
                                                            </tr>
                                                            : null

                                                    }
                                                </tbody>
                                            </table>

                                        </Col>
                                        <Col xs={12} md={6} lg={6} className="rightTable">
                                            <table>
                                                <tbody>
                                                    {
                                                        (item['other-artefacts'].length <= 1) ?
                                                            <tr>
                                                                <td >{item['macos-installer']}</td>
                                                                <td><a href={`${process.env.distServer}/downloads/${item.version}/${item['macos-installer']}`}
                                                                    name={item['macos-installer']} data-pack={item['macos-installer']} target="">
                                                                    <Image src={`${prefix}/images/download-bg-green-fill.svg`} width={13} height={13} alt={item['macos-installer']} />
                                                                </a>
                                                                </td>
                                                                <td><a href={`${process.env.distServer}/downloads/${item.version}/${item['macos-installer']}.md5`}>md5</a></td>
                                                                <td><a href={`${process.env.distServer}/downloads/${item.version}/${item['macos-installer']}.sha1`}>SHA-1</a></td>
                                                                <td><a href={`${process.env.distServer}/downloads/${item.version}/${item['macos-installer']}.asc`}>asc</a></td>
                                                            </tr>
                                                            : null
                                                    }

                                                    {
                                                        (item['other-artefacts'].length > 1) ?
                                                            item['other-artefacts'].map((ot, index) => (
                                                                <tr key={ot}>
                                                                    <td >{ot}</td>
                                                                    <td><a href={`${process.env.distServer}/downloads/${item.version}/${ot}`}
                                                                        name={ot} data-pack={ot} target="">
                                                                        <Image src={`${prefix}/images/download-bg-green-fill.svg`} width={13} height={13} alt={ot} />
                                                                    </a>
                                                                    </td>
                                                                    <td><a href={`${process.env.distServer}/downloads/${item.version}/${ot}.md5`}>md5</a></td>
                                                                    <td><a href={`${process.env.distServer}/downloads/${item.version}/${ot}.sha1`}>SHA-1</a></td>
                                                                    <td><a href={`${process.env.distServer}/downloads/${item.version}/${ot}.asc`}>asc</a></td>
                                                                </tr>
                                                            ))
                                                            :
                                                            <tr>
                                                                <td >{item['other-artefacts']}</td>
                                                                <td><a href={`${process.env.distServer}/downloads/${item.version}/${item['other-artefacts']}`}
                                                                    name={item['other-artefacts']} data-pack={item['other-artefacts']} target="">
                                                                    <Image src={`${prefix}/images/download-bg-green-fill.svg`} width={13} height={13} alt={item['other-artefacts']} />
                                                                </a>
                                                                </td>
                                                                <td><a href={`${process.env.distServer}/downloads/${item.version}/${item['other-artefacts']}.md5`}>md5</a></td>
                                                                <td><a href={`${process.env.distServer}/downloads/${item.version}/${item['other-artefacts']}.sha1`}>SHA-1</a></td>
                                                                <td><a href={`${process.env.distServer}/downloads/${item.version}/${item['other-artefacts']}.asc`}>asc</a></td>
                                                            </tr>

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
                            <h2 id='1.0.x-archived-versions'>1.0.x archived versions</h2>
                            {sortedRelease10x.map((item, index) => (

                                <div className="installers" key={item.version}>
                                    <h3 className="releaseVersion" id={item.version}>{item.version} ({item['release-date']})</h3>
                                    <Row className="releasesRow">
                                        <Col xs={12} md={6} lg={6} className="leftTable">
                                            <table>
                                                <tbody>
                                                    <tr>
                                                        <td >{item['linux-installer']}</td>
                                                        <td><a href={`${process.env.distServer}/downloads/${item.version}/${item['linux-installer']}`}
                                                            name={item['linux-installer']} data-pack={item['linux-installer']} target="">
                                                            <Image src={`${prefix}/images/download-bg-green-fill.svg`} width={13} height={13} alt={item['linux-installer']} />
                                                        </a>
                                                        </td>
                                                        <td><a href={`${process.env.distServer}/downloads/${item.version}/${item['linux-installer']}.md5`}>md5</a></td>
                                                        <td><a href={`${process.env.distServer}/downloads/${item.version}/${item['linux-installer']}.sha1`}>SHA-1</a></td>
                                                        <td><a href={`${process.env.distServer}/downloads/${item.version}/${item['linux-installer']}.asc`}>asc</a></td>
                                                    </tr>
                                                    <tr>
                                                        <td >{item['windows-installer']}</td>
                                                        <td><a href={`${process.env.distServer}/downloads/${item.version}/${item['windows-installer']}`}
                                                            name={item['windows-installer']} data-pack={item['windows-installer']} target="">
                                                            <Image src={`${prefix}/images/download-bg-green-fill.svg`} width={13} height={13} alt={item['windows-installer']} />
                                                        </a>
                                                        </td>
                                                        <td><a href={`${process.env.distServer}/downloads/${item.version}/${item['windows-installer']}.md5`}>md5</a></td>
                                                        <td><a href={`${process.env.distServer}/downloads/${item.version}/${item['windows-installer']}.sha1`}>SHA-1</a></td>
                                                        <td><a href={`${process.env.distServer}/downloads/${item.version}/${item['windows-installer']}.asc`}>asc</a></td>
                                                    </tr>

                                                    {
                                                        (item['other-artefacts'].length > 1) ?
                                                            <tr>
                                                                <td >{item['macos-installer']}</td>
                                                                <td><a href={`${process.env.distServer}/downloads/${item.version}/${item['macos-installer']}`}
                                                                    name={item['macos-installer']} data-pack={item['macos-installer']} target="">
                                                                    <Image src={`${prefix}/images/download-bg-green-fill.svg`} width={13} height={13} alt={item['macos-installer']} />
                                                                </a>
                                                                </td>
                                                                <td><a href={`${process.env.distServer}/downloads/${item.version}/${item['macos-installer']}.md5`}>md5</a></td>
                                                                <td><a href={`${process.env.distServer}/downloads/${item.version}/${item['macos-installer']}.sha1`}>SHA-1</a></td>
                                                                <td><a href={`${process.env.distServer}/downloads/${item.version}/${item['macos-installer']}.asc`}>asc</a></td>
                                                            </tr>
                                                            : null

                                                    }
                                                </tbody>
                                            </table>

                                        </Col>
                                        <Col xs={12} md={6} lg={6} className="rightTable">
                                            <table>
                                                <tbody>
                                                    {
                                                        (item['other-artefacts'].length <= 1) ?
                                                            <tr>
                                                                <td >{item['macos-installer']}</td>
                                                                <td><a href={`${process.env.distServer}/downloads/${item.version}/${item['macos-installer']}`}
                                                                    name={item['macos-installer']} data-pack={item['macos-installer']} target="">
                                                                    <Image src={`${prefix}/images/download-bg-green-fill.svg`} width={13} height={13} alt={item['macos-installer']} />
                                                                </a>
                                                                </td>
                                                                <td><a href={`${process.env.distServer}/downloads/${item.version}/${item['macos-installer']}.md5`}>md5</a></td>
                                                                <td><a href={`${process.env.distServer}/downloads/${item.version}/${item['macos-installer']}.sha1`}>SHA-1</a></td>
                                                                <td><a href={`${process.env.distServer}/downloads/${item.version}/${item['macos-installer']}.asc`}>asc</a></td>
                                                            </tr>
                                                            : null
                                                    }

                                                    {
                                                        (item['other-artefacts'].length > 1) ?
                                                            item['other-artefacts'].map((ot, index) => (
                                                                <tr key={ot}>
                                                                    <td >{ot}</td>
                                                                    <td><a href={`${process.env.distServer}/downloads/${item.version}/${ot}`}
                                                                        name={ot} data-pack={ot} target="">
                                                                        <Image src={`${prefix}/images/download-bg-green-fill.svg`} width={13} height={13} alt={ot} />
                                                                    </a>
                                                                    </td>
                                                                    <td><a href={`${process.env.distServer}/downloads/${item.version}/${ot}.md5`}>md5</a></td>
                                                                    <td><a href={`${process.env.distServer}/downloads/${item.version}/${ot}.sha1`}>SHA-1</a></td>
                                                                    <td><a href={`${process.env.distServer}/downloads/${item.version}/${ot}.asc`}>asc</a></td>
                                                                </tr>
                                                            ))
                                                            :
                                                            <tr>
                                                                <td >{item['other-artefacts']}</td>
                                                                <td><a href={`${process.env.distServer}/downloads/${item.version}/${item['other-artefacts']}`}
                                                                    name={item['other-artefacts']} data-pack={item['other-artefacts']} target="">
                                                                    <Image src={`${prefix}/images/download-bg-green-fill.svg`} width={13} height={13} alt={item['other-artefacts']} />
                                                                </a>
                                                                </td>
                                                                <td><a href={`${process.env.distServer}/downloads/${item.version}/${item['other-artefacts']}.md5`}>md5</a></td>
                                                                <td><a href={`${process.env.distServer}/downloads/${item.version}/${item['other-artefacts']}.sha1`}>SHA-1</a></td>
                                                                <td><a href={`${process.env.distServer}/downloads/${item.version}/${item['other-artefacts']}.asc`}>asc</a></td>
                                                            </tr>

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
                            <h2 id='0.9.x-archived-versions'>0.9.x archived versions</h2>
                            {sortedRelease09x.map((item, index) => (

                                <div className="installers" key={item.version}>
                                    <h3 className="releaseVersion" id={item.version}>{item.version} ({item['release-date']})</h3>
                                    <Row className="releasesRow">
                                        <Col xs={12} md={6} lg={6} className="leftTable">
                                            <table>
                                                <tbody>
                                                    <tr>
                                                        <td >{item['linux-installer']}</td>
                                                        <td><a href={`${process.env.distServer}/downloads/${item.version}/${item['linux-installer']}`}
                                                            name={item['linux-installer']} data-pack={item['linux-installer']} target="">
                                                            <Image src={`${prefix}/images/download-bg-green-fill.svg`} width={13} height={13} alt={item['linux-installer']} />
                                                        </a>
                                                        </td>
                                                        <td><a href={`${process.env.distServer}/downloads/${item.version}/${item['linux-installer']}.md5`}>md5</a></td>
                                                        <td><a href={`${process.env.distServer}/downloads/${item.version}/${item['linux-installer']}.sha1`}>SHA-1</a></td>
                                                        <td><a href={`${process.env.distServer}/downloads/${item.version}/${item['linux-installer']}.asc`}>asc</a></td>
                                                    </tr>
                                                    <tr>
                                                        <td >{item['windows-installer']}</td>
                                                        <td><a href={`${process.env.distServer}/downloads/${item.version}/${item['windows-installer']}`}
                                                            name={item['windows-installer']} data-pack={item['windows-installer']} target="">
                                                            <Image src={`${prefix}/images/download-bg-green-fill.svg`} width={13} height={13} alt={item['windows-installer']} />
                                                        </a>
                                                        </td>
                                                        <td><a href={`${process.env.distServer}/downloads/${item.version}/${item['windows-installer']}.md5`}>md5</a></td>
                                                        <td><a href={`${process.env.distServer}/downloads/${item.version}/${item['windows-installer']}.sha1`}>SHA-1</a></td>
                                                        <td><a href={`${process.env.distServer}/downloads/${item.version}/${item['windows-installer']}.asc`}>asc</a></td>
                                                    </tr>

                                                    {
                                                        (item['other-artefacts'].length > 1) ?
                                                            <tr>
                                                                <td >{item['macos-installer']}</td>
                                                                <td><a href={`${process.env.distServer}/downloads/${item.version}/${item['macos-installer']}`}
                                                                    name={item['macos-installer']} data-pack={item['macos-installer']} target="">
                                                                    <Image src={`${prefix}/images/download-bg-green-fill.svg`} width={13} height={13} alt={item['macos-installer']} />
                                                                </a>
                                                                </td>
                                                                <td><a href={`${process.env.distServer}/downloads/${item.version}/${item['macos-installer']}.md5`}>md5</a></td>
                                                                <td><a href={`${process.env.distServer}/downloads/${item.version}/${item['macos-installer']}.sha1`}>SHA-1</a></td>
                                                                <td><a href={`${process.env.distServer}/downloads/${item.version}/${item['macos-installer']}.asc`}>asc</a></td>
                                                            </tr>
                                                            : null

                                                    }
                                                </tbody>
                                            </table>
                                        </Col>
                                        <Col xs={12} md={6} lg={6} className="rightTable">
                                            <table>
                                                <tbody>
                                                    {
                                                        (item['other-artefacts'].length <= 1) ?
                                                            <tr>
                                                                <td >{item['macos-installer']}</td>
                                                                <td><a href={`${process.env.distServer}/downloads/${item.version}/${item['macos-installer']}`}
                                                                    name={item['macos-installer']} data-pack={item['macos-installer']} target="">
                                                                    <Image src={`${prefix}/images/download-bg-green-fill.svg`} width={13} height={13} alt={item['macos-installer']} />
                                                                </a>
                                                                </td>
                                                                <td><a href={`${process.env.distServer}/downloads/${item.version}/${item['macos-installer']}.md5`}>md5</a></td>
                                                                <td><a href={`${process.env.distServer}/downloads/${item.version}/${item['macos-installer']}.sha1`}>SHA-1</a></td>
                                                                <td><a href={`${process.env.distServer}/downloads/${item.version}/${item['macos-installer']}.asc`}>asc</a></td>
                                                            </tr>
                                                            : null
                                                    }

                                                    {
                                                        (item['other-artefacts'].length > 1) ?
                                                            item['other-artefacts'].map((ot, index) => (
                                                                <tr key={ot}>
                                                                    <td >{ot}</td>
                                                                    <td><a href={`${process.env.distServer}/downloads/${item.version}/${ot}`}
                                                                        name={ot} data-pack={ot} target="">
                                                                        <Image src={`${prefix}/images/download-bg-green-fill.svg`} width={13} height={13} alt={ot} />
                                                                    </a>
                                                                    </td>
                                                                    <td><a href={`${process.env.distServer}/downloads/${item.version}/${ot}.md5`}>md5</a></td>
                                                                    <td><a href={`${process.env.distServer}/downloads/${item.version}/${ot}.sha1`}>SHA-1</a></td>
                                                                    <td><a href={`${process.env.distServer}/downloads/${item.version}/${ot}.asc`}>asc</a></td>
                                                                </tr>
                                                            ))
                                                            :
                                                            <tr>
                                                                <td >{item['other-artefacts']}</td>
                                                                <td><a href={`${process.env.distServer}/downloads/${item.version}/${item['other-artefacts']}`}
                                                                    name={item['other-artefacts']} data-pack={item['other-artefacts']} target="">
                                                                    <Image src={`${prefix}/images/download-bg-green-fill.svg`} width={13} height={13} alt={item['other-artefacts']} />
                                                                </a>
                                                                </td>
                                                                <td><a href={`${process.env.distServer}/downloads/${item.version}/${item['other-artefacts']}.md5`}>md5</a></td>
                                                                <td><a href={`${process.env.distServer}/downloads/${item.version}/${item['other-artefacts']}.sha1`}>SHA-1</a></td>
                                                                <td><a href={`${process.env.distServer}/downloads/${item.version}/${item['other-artefacts']}.asc`}>asc</a></td>
                                                            </tr>

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
            </Col>
        </Layout>

    );
}
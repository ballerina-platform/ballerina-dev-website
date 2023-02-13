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

import styles from './Videos.module.css';

export default function Videos() {

    return (
        <>
            <Row>
                <Col sm={12} md={5} lg={5} className={styles.fVideos}>
                    <h2 className="removeTopMargin">Featured videos &amp; podcasts</h2>

                    <div className={styles.videoInfo}>
                        <a target="_blank" rel="noreferrer" href="https://youtu.be/Pal5QZJyloY"><h4>Simplifying Cloud Native Application Development with Ballerina </h4></a>
                        <p> By Eric Newcomer and Darryl Taft</p>
                        <p> 8 June 2022</p>
                    </div>

                    <div className={styles.videoInfo}>
                        <a target="_blank" rel="noreferrer" href="https://youtu.be/8yRDvhMBj_E"><h4>Data-oriented Programming with Ballerina</h4></a>
                        <p> James Clark Interviewed by Yehonathan Sharvit</p>
                        <p> 27 April 2022</p>
                    </div>

                    <div className={`${styles.videoInfo} ${styles.last}`}>
                        <a target="_blank" rel="noreferrer" href="https://youtu.be/My_uqtHvXV8"><h4>Why should you start programming with Ballerina?</h4></a>
                        <p> By Sanjiva Weerawarana</p>
                        <p> 2 March 2022</p>
                    </div>
                </Col>

                <Col sm={12} md={7} lg={7} className={styles.videos}>
                    <h2 className="removeTopMargin">Videos &amp; podcasts</h2>
                    <div className={styles.videoWrapper}>

                        <div className={styles.videoInfo}>
                            <a target="_blank" rel="noreferrer" href="https://youtu.be/Pal5QZJyloY"><h4>Simplifying Cloud Native Application Development with Ballerina</h4></a>
                            <p> Eric Newcomer and Darryl Taft</p>
                            <p> 8 June 2022</p>
                        </div>

                        <div className={styles.videoInfo}>
                            <a target="_blank" rel="noreferrer" href="https://youtu.be/8yRDvhMBj_E"><h4>Data-oriented Programming with Ballerina</h4></a>
                            <p> James Clark Interviewed by Yehonathan Sharvit</p>
                            <p> 27 April 2022</p>
                        </div>

                        <div className={styles.videoInfo}>
                            <a target="_blank" rel="noreferrer" href="https://youtu.be/NYrKeElltg8"><h4>Why should you start programming with Ballerina?</h4></a>
                            <p> By Sanjiva Weerawarana</p>
                            <p> 2 March 2022</p>
                        </div>

                        <div className={styles.videoInfo}>
                            <a target="_blank" rel="noreferrer" href="https://youtu.be/QlS_8-yaN68"><h4>Ballerina Swan Lake: The Open Source Cloud Native Programming Language Revamped</h4></a>
                            <p> By Imesha Sudasingha</p>
                            <p> 15 Dec 2021</p>
                        </div>

                        <div className={styles.videoInfo}>
                            <a target="_blank" rel="noreferrer" href="https://www.infoq.com/podcasts/james-clark-ballerina-language-network-data-concurrency/"><h4>How Ballerina Handles Network Interaction, Data, and Concurrency</h4></a>
                            <p> By James Clark &amp; Charles Humble</p>
                            <p> 11 Nov 2021</p>
                        </div>

                        <div className={styles.videoInfo}>
                            <a target="_blank" rel="noreferrer" href="https://youtu.be/_4x5v4rGUOw"><h4>Ballerina Type System</h4></a>
                            <p> By James Clark</p>
                            <p> 26 Oct 2021</p>
                        </div>

                        <div className={styles.videoInfo}>
                            <a target="_blank" rel="noreferrer" href="https://youtu.be/NxyIKoHl3Dw"><h4>Creating a Service in Ballerina - Tutorial</h4></a>
                            <p> By Manuranga Perera</p>
                            <p> 1 June 2021</p>
                        </div>

                        <div className={styles.videoInfo}>
                            <a target="_blank" rel="noreferrer" href="https://youtu.be/My_uqtHvXV8"><h4>Familiar Subset - Ballerina Language, Swan Lake (Part 1)</h4></a>
                            <p> By James Clark</p>
                            <p> 31 May 2021</p>
                        </div>

                        <div className={styles.videoInfo}>
                            <a target="_blank" rel="noreferrer" href="https://youtu.be/leFnR6xh100"><h4>Network and Data - Ballerina Language Swan Lake: Part 2a</h4></a>
                            <p> By James Clark</p>
                            <p> 31 May 2021</p>
                        </div>

                        <div className={styles.videoInfo}>
                            <a target="_blank" rel="noreferrer" href="https://youtu.be/BvU9fB-x8eE"><h4>Query, Tables, and XML - Ballerina Language Swan Lake: Part 2b</h4></a>
                            <p> By James Clark</p>
                            <p> 31 May 2021</p>
                        </div>

                        <div className={styles.videoInfo}>
                            <a target="_blank" rel="noreferrer" href="https://youtu.be/C1kj3Lc9MP8"><h4>Concurrency - Ballerina Language Swan Lake: Part 2c</h4></a>
                            <p> By James Clark</p>
                            <p> 31 May 2021</p>
                        </div>

                        <div className={`${styles.videoInfo} ${styles.last}`}>
                            <a target="_blank" rel="noreferrer" href="https://youtu.be/dAQs8_jAyGU"><h4>Completing the Picture - Ballerina Language Swan Lake: Part 3</h4></a>
                            <p> By James Clark</p>
                            <p> 31 May 2021</p>
                        </div>
                    </div>
                </Col>
            </Row>
        </>

    );
}

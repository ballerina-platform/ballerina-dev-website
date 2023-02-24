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
import { Row, Col, Container } from 'react-bootstrap';
import dynamic from 'next/dynamic';

import styles from './Events.module.css';
import { prefix } from '../../../utils/prefix';

export default function Events() {

    const UpcomingEvents = dynamic(() => import('../../common/upcoming-events/UpcomingEvents'), { ssr: false });

    const [hoverBtn, setHoverBtn] = React.useState(false);

    let linkArrowPath = prefix + '/images/toc-bg.svg';
    let linkArrowHoverPath = prefix + '/images/toc-bg-hover.svg';

    const linkArrow = {
        background: 'url(' + linkArrowPath + ') no-repeat scroll right center',
        paddingRight: '25px'
    }

    const linkArrowHover = {
        background: 'url(' + linkArrowHoverPath + ') no-repeat scroll right center',
        paddingRight: '25px'
    }

    return (
        <Col xs={12}>
            <Container>
                <Row>
                    <Col xs={12}>
                        <h2 id='events'>Events</h2>
                    </Col>
                </Row>

                <Row>
                    <Col sm={12} md={6} lg={6}>
                        <p>
                            Join us at our upcoming events and be a part of the conversation from anywhere in the world. We host or take part in events where we talk about language features and updates, present demos, and explore Ballerina use cases.
                        </p>
                    </Col>

                    <Col sm={12} md={6} lg={6}>
                        <p className={styles.linkWrap}
                            onMouseEnter={() => {
                                setHoverBtn(true);
                            }}
                            onMouseLeave={() => {
                                setHoverBtn(false);
                            }}
                            style={
                                (hoverBtn ? linkArrowHover : linkArrow)
                            }>
                            <a href={`${prefix}/community/events`} rel="noreferrer" target="_blank" className={styles.viewAll}>View all events </a>
                        </p>
                    </Col>
                </Row>

                <Row className={styles.upcomingSection}>
                    <Col sm={12}>
                        <h3 className={styles.upcoming}>Upcoming events</h3>
                    </Col>
                </Row>

                <UpcomingEvents />
            </Container>
        </Col>
    );
}

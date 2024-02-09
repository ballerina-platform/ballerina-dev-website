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
import EventsData from '../../../_data/events.json';

export function getUpcomingEvents(now) {
    const events = EventsData.events;
    let upcomingEvents = false;

    for (var i = 0; i < events.length; i++) {
        if (now < Date.parse(events[i].expire)) {
            upcomingEvents = true;
            break;
        }
    }

    return upcomingEvents;

}


export default function Events(props) {

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

    const [now, setNow] = React.useState(new Date());

    React.useEffect(() => {
        setNow(new Date());
    }, [])

    const upcomingEvents = getUpcomingEvents(now);

    return (
        <Col xs={12}>
            <Container>
                <Row>
                    <Col xs={12}>
                        <h2 id='events' className='section'>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="30"
                                height="30"
                                fill="currentColor"
                                className="bi bi-link-45deg mdButton pe-2"
                                viewBox="0 0 16 16"
                                onClick={(e) => props.getLink(e.target, 'events')}
                            >
                                <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                                <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
                            </svg>
                            Events
                        </h2>
                    </Col>
                </Row>

                <Row>
                    <Col sm={12} md={6} lg={6}>
                        <p>
                            Join us at our upcoming events and be a part of the conversation from anywhere in the world. We either host or participate in events where we talk about Ballerina's features and updates, present demos, and explore practical use cases.
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
                            <a href={`${prefix}/community/events`} className={styles.viewAll}>View all events </a>
                        </p>
                    </Col>
                </Row>
                {
                    upcomingEvents &&
                    <>
                        <Row className={styles.upcomingSection}>
                            <Col sm={12}>
                                <h3 className={styles.upcoming}>Upcoming events</h3>
                            </Col>
                        </Row>

                        <UpcomingEvents />
                    </>
                }
            </Container>
        </Col>
    );
}

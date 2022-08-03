import * as React from 'react';
import { Row, Col, Container } from 'react-bootstrap';

import NewsletterSubscription from '../../common/newsletter-subscription/NewsletterSubscription';
import styles from './Newsletter.module.css';
import { prefix } from '../../../utils/prefix';

export default function Newsletter() {

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
                        <h2 id='subscribe-to-our-newsletter'>Subscribe to our newsletter</h2>
                    </Col>
                </Row>

                <Row>
                    <Col sm={12} md={6} lg={6}>
                        <NewsletterSubscription />
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
                            <a href={`${prefix}/community/ballerina-newsletter`} target="_blank" rel="noreferrer" className={styles.viewAll}>View all newsletters </a>
                        </p>
                    </Col>
                </Row>
            </Container>
        </Col>
    );
}

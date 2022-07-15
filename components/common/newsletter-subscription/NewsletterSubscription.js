import * as React from 'react';

import styles from './NewsletterSubscription.module.css';

export default function NewsletterSubscription() {

    return (
        <>
            <p>
                Want to get hand-picked content and the latest news on Ballerina delivered directly to your inbox? Then subscribe to our monthly newsletter today!
            </p>
            <iframe src="https://resources.wso2.com/l/142131/2022-01-05/b3x14k" width="100%" type="text/html" frameBorder="0" allowTransparency="true" className={styles.iframe}></iframe>
        </>
    );
}

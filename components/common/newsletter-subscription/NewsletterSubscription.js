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
import { prefix } from '../../../utils/prefix';
import styles from './NewsletterSubscription.module.css';
import Image from 'next-image-export-optimizer';

export default function NewsletterSubscription(props) {

    const [hoverBtn, setHoverBtn] = React.useState(false);

    let linkArrowPath = prefix + '/images/toc-bg.svg';
    let linkArrowHoverPath = prefix + '/images/toc-bg-hover.svg';

    return (
        <>
            <p>
                Want to get hand-picked content and the latest news on Ballerina delivered directly to your inbox? Then subscribe to our newsletter today!
            </p>
            <p className={styles.linkWrap}
                onMouseEnter={() => {
                    setHoverBtn(true);
                }}
                onMouseLeave={() => {
                    setHoverBtn(false);
                }}
            >
                {
                    props.showLink &&
                    <a href={`${prefix}/community/ballerina-newsletter`} className={styles.viewAll}>
                    View all newsletters <Image src={`${hoverBtn ? linkArrowHoverPath : linkArrowPath}`} width={20} height={20} alt="Left Arrow" />
                </a>
                }

                {
                    props.showForm &&
                    <iframe src="https://resources.wso2.com/l/142131/2022-01-05/b3x14k" width="100%" type="text/html" frameBorder="0" allowTransparency="true" className={styles.iframe}></iframe>
                }

            </p >
        </>
    );
}

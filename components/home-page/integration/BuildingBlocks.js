/**
 * Copyright (c) 2026, WSO2 LLC (http://www.wso2.com) All Rights Reserved.
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
import styles from './BuildingBlocks.module.css';

// A layered stack of building blocks. Everything inside the frame is provided by
// Ballerina. The optional base sits outside the frame: the systems the stack connects to.
export default function BuildingBlocks({ title, layers, base, caption, onGrey }) {
    return (
        <figure className={`${styles.card} ${onGrey ? styles.onGrey : ''}`}>
            <p className={styles.title}>{title}</p>

            <div className={styles.frame}>
                <p className={styles.frameLabel}>
                    <svg aria-hidden="true" width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M13.485 3.929a1 1 0 0 1 0 1.414l-6.364 6.364a1 1 0 0 1-1.414 0L2.515 8.515a1 1 0 1 1 1.414-1.414l2.485 2.485 5.657-5.657a1 1 0 0 1 1.414 0z" />
                    </svg>
                    Built into Ballerina
                </p>

                {layers.map((layer) => (
                    <div key={layer.name} className={styles.layer}>
                        <div className={styles.layerLabel}>
                            <span className={styles.layerName}>{layer.name}</span>
                            <span className={styles.layerRole}>{layer.role}</span>
                        </div>
                        <ul className={`${styles.blocks} ${layer.blocks.length > 1 ? styles[`cols${layer.blocks.length}`] : ''}`}>
                            {layer.blocks.map((b) => (
                                <li key={b.title} className={styles.block}>
                                    <span className={styles.blockTitle}>{b.title}</span>
                                    <span className={styles.blockSub}>{b.sub}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            {base && (
                <div className={styles.base}>
                    <p className={styles.baseLabel}>{base.label}</p>
                    <ul className={`${styles.baseItems} ${base.items.length === 1 ? styles.single : ''}`}>
                        {base.items.map((item) => (typeof item === 'string'
                            ? <li key={item}>{item}</li>
                            : (
                                <li key={item.title}>
                                    <span className={styles.baseTitle}>{item.title}</span>
                                    <span className={styles.baseSub}>{item.sub}</span>
                                </li>
                            )))}
                    </ul>
                </div>
            )}

            <figcaption className={styles.caption}>{caption}</figcaption>
        </figure>
    );
}

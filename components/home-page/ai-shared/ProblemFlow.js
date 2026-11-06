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
import { BsPlusLg } from 'react-icons/bs';

import { prefix } from '../../../utils/prefix';
import styles from './ProblemFlow.module.css';

function Arrow() {
    return (
        <div className={styles.arrow} aria-hidden="true">
            <svg width="28" height="16" viewBox="0 0 28 16" fill="none">
                <path d="M1 8h22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M18 2.5 25 8l-7 5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </div>
    );
}

// A titled list of icon rows: the challenges on the left and the outcomes on the right.
function ListBox({ title, items, variant }) {
    return (
        <div className={`${styles.box} ${variant ? styles[variant] : ''}`}>
            <p className={styles.boxTitle}>{title}</p>
            <ul className={styles.list}>
                {items.map(({ icon: Icon, title: itemTitle, sub }) => (
                    <li key={itemTitle}>
                        <span className={styles.listIcon} aria-hidden="true"><Icon /></span>
                        <span className={styles.listText}>
                            <span className={styles.listTitle}>{itemTitle}</span>
                            {sub && <span className={styles.listSub}>{sub}</span>}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

// The LLMs that drive an agent. They sit outside Ballerina, so the box is dashed.
function LlmBox({ title, note, providers }) {
    return (
        <div className={`${styles.box} ${styles.llm}`}>
            <p className={styles.llmTitle}>
                {title}
                {note && <span className={styles.llmNote}>{note}</span>}
            </p>
            <ul className={styles.logos}>
                {providers.map(({ name, color, icon: Icon }) => (
                    <li key={name} title={name} style={color ? { color } : undefined}>
                        <Icon aria-hidden="true" />
                        <span className={styles.srOnly}>{name}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function Tiles({ tiles, cols }) {
    return (
        <ul className={`${styles.tiles} ${styles[`cols${cols}`]}`}>
            {tiles.map(({ icon: Icon, title, sub }) => (
                <li key={title} className={styles.tile}>
                    <span className={styles.tileIcon} aria-hidden="true"><Icon /></span>
                    <span className={styles.tileTitle}>{title}</span>
                    <span className={styles.tileSub}>{sub}</span>
                </li>
            ))}
        </ul>
    );
}

// Challenges flow into Ballerina, which turns them into outcomes.
export default function ProblemFlow({ label, challenges, llm, groups, outcomes }) {
    return (
        <figure className={styles.flow} aria-label={label}>
            <ListBox {...challenges} variant="challenges" />
            <Arrow />

            <div className={styles.core}>
                {llm && <LlmBox {...llm} />}
                {llm && <Arrow />}

                <div className={styles.center}>
                    <p className={styles.centerHead}>
                        <img src={`${prefix}/images/ballerina-logo.svg`} alt="Ballerina" width="110" height="20" />
                    </p>
                    {groups.map((group, i) => (
                        <div key={group.label || i} className={styles.group}>
                            {group.label && (
                                <p className={styles.groupLabel}>
                                    {i > 0 && <span className={styles.plus} aria-hidden="true"><BsPlusLg /></span>}
                                    {group.icon && <group.icon aria-hidden="true" className={styles.groupIcon} />}
                                    {group.label}
                                    {group.note && <span className={styles.groupNote}>{group.note}</span>}
                                </p>
                            )}
                            <Tiles tiles={group.tiles} cols={group.cols} />
                        </div>
                    ))}
                </div>
            </div>

            <Arrow />
            <ListBox {...outcomes} variant="outcomes" />
        </figure>
    );
}

/**
 * Copyright (c) 2023, WSO2 LLC (http://www.wso2.com) All Rights Reserved.
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

import React, { useState } from "react";
import { Accordion } from "react-bootstrap";

import styles from './TopNav.module.css';

const CustomMenu = React.forwardRef(
    ({ children, style, className, "aria-labelledby": labeledBy, launcher }, ref) => {
        const [value, setValue] = useState("");

        return (
            <div
                ref={ref}
                style={style}
                className={className}
                aria-labelledby={labeledBy}
            >
                {
                    (launcher === 'mobile') ?
                        <>
                            <Accordion.Item eventKey="usecases" className={styles.acItem}>
                                <Accordion.Header className={styles.mainDir}>Use cases</Accordion.Header>
                                <Accordion.Body className={styles.accordionBody}>
                                    {
                                        React.Children.toArray(children).filter(
                                            (child, index) => {
                                                if (child.props.category.toLowerCase().startsWith('usecases')) {
                                                    return (
                                                        <li key={index}>
                                                            {child}
                                                        </li>
                                                    )
                                                }
                                            }
                                        )
                                    }
                                </Accordion.Body>
                            </Accordion.Item>
                            {/* <Accordion.Item eventKey="case studies" className={styles.acItem}>
                                <Accordion.Header className={styles.mainDir}>Case studies</Accordion.Header>
                                <Accordion.Body className={styles.accordionBody}>
                                    {
                                        React.Children.toArray(children).filter(
                                            (child, index) => {
                                                if (child.props.category.toLowerCase().startsWith('case studies')) {
                                                    return (
                                                        <li key={index}>
                                                            {child}
                                                        </li>
                                                    )
                                                }
                                            }
                                        )
                                    }
                                </Accordion.Body>
                            </Accordion.Item> */}
                            <Accordion.Item eventKey="comparisons" className={styles.acItem}>
                                <Accordion.Header className={styles.mainDir}>Comparisons</Accordion.Header>
                                <Accordion.Body className={styles.accordionBody}>
                                    {
                                        React.Children.toArray(children).filter(
                                            (child, index) => {
                                                if (child.props.category.toLowerCase().startsWith('comparisons')) {
                                                    return (
                                                        <li key={index}>
                                                            {child}
                                                        </li>
                                                    )
                                                }
                                            }
                                        )
                                    }
                                </Accordion.Body>
                            </Accordion.Item>
                        </>
                        :
                        <div className={styles.subSections}>

                            <div className={styles.subSection}>
                                <p>Use cases</p>
                                <ul className="list-unstyled">
                                    {
                                        React.Children.toArray(children).filter(
                                            (child, index) => {
                                                if (child.props.category.toLowerCase().startsWith('usecases')) {
                                                    return (
                                                        <li key={index}>
                                                            {child}
                                                        </li>
                                                    )
                                                }
                                            }
                                        )
                                    }
                                </ul>
                            </div>

                            {/* <div className={styles.subSection}>
                                <p>Case studies</p>
                                <ul className="list-unstyled">
                                    {
                                        React.Children.toArray(children).filter(
                                            (child, index) => {
                                                if (child.props.category.toLowerCase().startsWith('case studies')) {
                                                    return (
                                                        <li key={index}>
                                                            {child}
                                                        </li>
                                                    )
                                                }
                                            }
                                          )
                                    }
                                </ul>
                            </div> */}


                            <div className={styles.subSection}>
                                <p>Comparisons</p>
                                <ul className="list-unstyled">
                                    {
                                        React.Children.toArray(children).filter(
                                            (child, index) => {
                                                if (child.props.category.toLowerCase().startsWith('comparisons')) {
                                                    return (
                                                        <li key={index}>
                                                            {child}
                                                        </li>
                                                    )
                                                }
                                            }
                                        )
                                    }
                                </ul>
                            </div>
                        </div>
                }

            </div>
        );
    }
);

CustomMenu.displayName = 'CustomMenu';

export default CustomMenu;
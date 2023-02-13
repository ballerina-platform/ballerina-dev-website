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
import Accordion from 'react-bootstrap/Accordion';

import { prefix } from '../../../utils/prefix';
import styles from './LeftNav.module.css';

export default function LeftNav(props) {
  const launcher = props.launcher;
  let id = props.id;
  let mainDir = props.mainDir;
  let sub = props.sub;
  let third = props.third;
  const Elements = props.Toc.subDirectories;

  function comparePositions(a, b) {
    return a.position - b.position;
  }

  function CheckActive(eventKey) {

    if (mainDir !== eventKey) {
      document.querySelectorAll('[item-id=' + "\'" + mainDir + "\'" + ']')[0].getElementsByTagName('button')[0].style.color = '#20b6b0';
      document.querySelectorAll('[item-id=' + "\'" + mainDir + "\'" + ']')[0].getElementsByTagName('button')[0].style.fontWeight = '500';
    }

    if (sub && sub !== eventKey) {
      document.querySelectorAll('[item-id=' + sub + ']')[0].getElementsByTagName('button')[0].style.color = '#20b6b0';
      document.querySelectorAll('[item-id=' + sub + ']')[0].getElementsByTagName('button')[0].style.fontWeight = '500';
    }

    if (third && third !== eventKey) {
      document.querySelectorAll('[item-id=' + third + ']')[0].getElementsByTagName('button')[0].style.color = '#20b6b0';
      document.querySelectorAll('[item-id=' + third + ']')[0].getElementsByTagName('button')[0].style.fontWeight = '500';
    }
  }



  const SortedDir = Elements.sort(comparePositions);

  function MainDir(props) {
    let category = props.category;

    return <Accordion.Item eventKey={category.id} className={styles.acItem}>
      <Accordion.Header className={styles.mainDir} onClick={() => CheckActive(category.id)} item-id={category.id}>{category.dirName}</Accordion.Header>
      <Accordion.Body className={styles.accordionBody}>
        <ul className={styles.firstTier}>
          {
            (category.subDirectories) ?
              <Accordion defaultActiveKey={sub}>
                <SubDir directories={category.subDirectories} activeKey={sub} />
              </Accordion>
              : null
          }
        </ul>
      </Accordion.Body>
    </Accordion.Item>;
  }

  function SubDir(props) {
    let directories = props.directories.sort(comparePositions);

    return directories.map((directory) => (
      <>
        {
          (directory.isDir && directory.position > 0) ?
            <>
              <Accordion.Item eventKey={directory.id} className={styles.acItem}>
                <Accordion.Header onClick={() => CheckActive(directory.id)} item-id={directory.id}>{directory.dirName}</Accordion.Header>
                <Accordion.Body className={styles.acBody}>
                  <ul className={styles.secondTier}>
                    {
                      (directory.subDirectories) ?
                        <Accordion defaultActiveKey={third}>
                          <ThirdDir directories={directory.subDirectories} activeKey={third} />
                        </Accordion>
                        : null
                    }

                  </ul>
                </Accordion.Body>
              </Accordion.Item>
            </>
            :
            (directory.position > 0) ?
              <li key={directory.id}>
                {(directory.dirName === 'API Docs') ?
                  <a id={directory.id} className={(id === directory.id) ? styles.active : null}
                    href={(`${prefix}`) ? `${prefix}` + directory.url : directory.url}
                    target='_blank' rel="noreferrer">
                    {directory.dirName}
                  </a>
                  :
                  <a id={directory.id} className={(id === directory.id) ? styles.active : null}
                    href={(`${prefix}`) ? `${prefix}` + directory.url : directory.url}>
                    {directory.dirName}
                  </a>
                }
              </li>
              : null
        }
      </>

    ));
  }

  function ThirdDir(props) {
    let tdirectories = props.directories.sort(comparePositions);

    return tdirectories.map((directory) => (
      <>
        {
          (directory.isDir && directory.position > 0) ?
            <>
              <Accordion.Item eventKey={directory.id} className={styles.acItem}>
                <Accordion.Header onClick={() => CheckActive(directory.id)} item-id={directory.id}>{directory.dirName}</Accordion.Header>
                <Accordion.Body className={styles.acBody}>
                  <ul className={styles.secondTier}>
                    {
                      (directory.subDirectories) ?
                        <Accordion defaultActiveKey={third}>
                          <ThirdDir directories={directory.subDirectories} activeKey={third} />
                        </Accordion>
                        : null
                    }
                  </ul>
                </Accordion.Body>
              </Accordion.Item>
            </>
            :
            (directory.position > 0) ?
              <li key={directory.id}>
                <a id={directory.id} className={(id === directory.id) ? styles.active : null}
                  href={(`${prefix}`) ? `${prefix}` + directory.url : directory.url}>
                  {directory.dirName}
                </a>
              </li>
              : null
        }
      </>

    ));
  }

  return (
    <>

      <Accordion defaultActiveKey={mainDir} flush className={styles.leftNavAccordian}>
        {SortedDir.map((category, index) => (
          {
            'learn': (category.position > 0) ? <MainDir category={category} key={index}/> : null,
            'rn': (category.position > 0) ? <MainDir category={category} key={index}/> : null,
            'archived': (category.position > 0) ? <MainDir category={category} key={index}/> : null,
          }[launcher]
        ))}
      </Accordion>

    </>
  );
}
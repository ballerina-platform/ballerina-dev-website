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
  const Elements = props.LearnToc.subDirectories;

  function comparePositions(a, b) {
    return a.position - b.position;
  }

  const SortedDir = Elements.sort(comparePositions);

  function MainDir(props) {
    let category = props.category;
    // console.log(props);

    return <Accordion.Item eventKey={category.id}>
      <Accordion.Header className={styles.mainDir}>{category.dirName}</Accordion.Header>
      <Accordion.Body className={styles.accordionBody}>
        <ul className={styles.firstTier}>
          {
            (category.subDirectories) ?
              <SubDir directories={category.subDirectories} activeKey={sub} />
              : null
          }
        </ul>
      </Accordion.Body>
    </Accordion.Item>;
  }

  function SubDir(props) {
    let directories = props.directories.sort(comparePositions);
    let activeKey = props.activeKey;
    return directories.map((directory) => (
      <>
        {
          (directory.isDir && directory.position > 0) ?
            <>
              <Accordion defaultActiveKey={activeKey}>
                <Accordion.Item eventKey={directory.id}>
                  <Accordion.Header>{directory.dirName}</Accordion.Header>
                  <Accordion.Body className={styles.acBody}>
                    <ul className={styles.secondTier}>
                      {
                        (directory.subDirectories) ?
                          <ThirdDir directories={directory.subDirectories} activeKey={third} />
                          : null
                      }

                    </ul>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
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

  function ThirdDir(props) {
    let tdirectories = props.directories.sort(comparePositions);
    let activeKey = props.activeKey;
    return tdirectories.map((directory) => (
      <>
        {
          (directory.isDir && directory.position > 0) ?
            <>
              <Accordion defaultActiveKey={activeKey}>
                <Accordion.Item eventKey={directory.id}>
                  <Accordion.Header>{directory.dirName}</Accordion.Header>
                  <Accordion.Body className={styles.acBody}>
                    <ul className={styles.secondTier}>
                      {
                        (directory.subDirectories) ?
                          <ThirdDir directories={directory.subDirectories} activeKey={third} />
                          : null
                      }
                    </ul>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
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
        {SortedDir.map((category) => (

          {
            'learn': (category.position > 0) ? <MainDir category={category} /> : null,
            'why-bal': (category.dirName === 'Why Ballerina') ? <MainDir category={category} /> : null,
            'rn': (category.position > 0) ? <MainDir category={category} /> : null,
          }[launcher]
        ))}
      </Accordion>

    </>
  );
}

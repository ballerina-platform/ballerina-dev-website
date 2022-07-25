import React, { useState, useEffect } from "react";
import Accordion from "react-bootstrap/Accordion";
import { prefix } from "../../../utils/prefix";
import styles from "./LeftNav.module.css";

export default function LeftNavYaml({ navContent, bbe }) {
  const [baseUrl, setBaseUrl] = useState("");
  const [activeTopLevel, setActiveTopLevel] = useState(null);
  const [activeSubLevel, setActiveSubLevel] = useState(null);

  useEffect(() => {
    for (let l1 of navContent.sublinks) {
      for (let l2 of l1.sublinks) {
        for (let bbeContent of l2.sublinks) {
          if (bbeContent.url === bbe) {
            setActiveTopLevel(l1.id);
            setActiveSubLevel(l2.id);
          }
        }
      }
    }
    setBaseUrl(navContent.url);
  }, [navContent, bbe]);

  function MainDir({ navContent }) {
    return (
      <Accordion
        defaultActiveKey={activeTopLevel}
        className={styles.leftNavAccordian}
        flush
      >
        {navContent &&
          navContent.sublinks.map((category, index) => (
            <Accordion.Item
              key={index}
              eventKey={category.id}
              className={styles.acItem}
            >
              <Accordion.Header className={styles.mainDir}>
                {category.title}
              </Accordion.Header>
              <Accordion.Body className={styles.accordionBody}>
                <ul className={styles.firstTier}>
                  {category.hasOwnProperty("sublinks") ? (
                    <SubDir
                      active={activeTopLevel === index + 1}
                      directories={category.sublinks}
                    />
                  ) : null}
                </ul>
              </Accordion.Body>
            </Accordion.Item>
          ))}
      </Accordion>
    );
  }

  function SubDir({ active = false, directories }) {
    return directories.map((directory) => (
      <>
        {directory.hasOwnProperty("sublinks") ? (
          <>
            <Accordion defaultActiveKey={active ? activeSubLevel : null}>
              <Accordion.Item eventKey={directory.id} className={styles.acItem}>
                <Accordion.Header>{directory.title}</Accordion.Header>
                <Accordion.Body className={styles.acBody}>
                  <ul className={styles.secondTier}>
                    <SubDir directories={directory.sublinks} />
                  </ul>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </>
        ) : (
          <li key={directory.id}>
            <a
              id={directory.id}
              className={bbe === directory.url ? styles.active : null}
              href={
                `${prefix}`
                  ? `${prefix}/${baseUrl}/${directory.url}`
                  : `/${baseUrl}/${directory.url}`
              }
            >
              {directory.title}
            </a>
          </li>
        )}
      </>
    ));
  }

  return <MainDir navContent={navContent} />;
}

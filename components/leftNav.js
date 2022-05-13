import * as React from 'react';
import Accordion from 'react-bootstrap/Accordion';

import LearnToc from "../files.json";

export default function LeftNav() {

  const Elements = LearnToc.subDirectories;

  function comparePositions(a, b) {
    return a.position - b.position;
  }
  
  const SortedDir = Elements.sort(comparePositions);

  function SubDir(props) {
    let directories = props.directories.sort(comparePositions);
    return directories.map((directory) => (
      <>
      {
      (directory.isDir && directory.position > 0) ?
      <>
        <Accordion>
          <Accordion.Item eventKey={directory.dirName}>
            <Accordion.Header>{directory.dirName}</Accordion.Header>
            <Accordion.Body>
              <ul className='secondTier'>
                <SubDir directories={directory.subDirectories}/>
              </ul>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
       </> 
        : 
          (directory.position > 0) ?
            <li><a href={directory.url}>{directory.dirName}</a></li>
          : null
      }
      </>
      
    ));
  }
  
  return (
    <>
    
    <Accordion defaultActiveKey="get-started" flush>
      {SortedDir.map((category) => (

        (category.position > 0) ?
        
        <Accordion.Item eventKey={category.dirName}>
          <Accordion.Header>{category.dirName}</Accordion.Header>
          <Accordion.Body>
            <ul className='firstTier'>
            {
            (category.subDirectories) ?
              <SubDir directories={category.subDirectories}/>
            : <li>{category.dirName}</li>
            }
            </ul>
          </Accordion.Body>
        </Accordion.Item>
        
        : null
      ))}
    </Accordion>
      
    </>
  );
}

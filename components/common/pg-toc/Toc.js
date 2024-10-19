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

import * as React from "react";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkHtml from "remark-html";

export default function Toc(props) {
  const source = props.source;
  let uniqueHeadingList = [];
  let hash = false;

  // Updated clickMe function to handle both TOC click and URL-based section navigation
  const clickMe = (triggerElement, sectionId, unique, fromUrl = false) => {
    if (triggerElement && triggerElement.tagName.toLowerCase() === "code") {
      triggerElement = triggerElement.parentElement;
    }

    const { id, sectionNumber } = extractIdAndSection(sectionId, unique);
    const element = getElementToScroll(id, sectionNumber);

    if (!fromUrl) {
      const tocItems = document.querySelectorAll(".title-anchor");
      tocItems.forEach(function (el) {
        el.classList.remove("active");
      });

      if (triggerElement) {
        triggerElement.classList.add("active");
      }
      
      // Update hash when clicked from TOC
      location.hash = "#" + sectionId;
    }

    scrollToElement(element);
  };

  //Highlight toc on scroll
  React.useEffect(() => {
    // Add event listener for hash changes
    window.addEventListener("hashchange", () => {
      hash = true;
      setTimeout(() => (hash = false), 1000);
      scrollToHash();
    });

    // If a hash exists in the URL on load, scroll to it
    if (window.location.hash) {
      setTimeout(() => {
        scrollToHash();
      }, 300);  // Add a delay to ensure the content is fully loaded
    }

    function scrollToHash() {
      const hashId = window.location.hash.substring(1); // Remove the "#" from hash
      const { id, sectionNumber } = extractIdAndSection(hashId);
    
      const element = getElementToScroll(id, sectionNumber);
    
      // Find the matching TOC item and simulate a click event for it
      const tocElement = document.querySelector(`[data-section="${hashId}"]`);
      clickMe(tocElement, hashId, false, true); // Pass fromUrl = true to skip hash update
    }
    
    // Updated clickMe function to skip hash update when coming from URL
    const clickMe = (triggerElement, sectionId, unique, fromUrl = false) => {
      if (triggerElement && triggerElement.tagName.toLowerCase() === "code") {
        triggerElement = triggerElement.parentElement;
      }
    
      const { id, sectionNumber } = extractIdAndSection(sectionId, unique);
      const element = getElementToScroll(id, sectionNumber);
    
      if (!fromUrl) {
        const tocItems = document.querySelectorAll(".title-anchor");
        tocItems.forEach(function (el) {
          el.classList.remove("active");
        });
    
        if (triggerElement) {
          triggerElement.classList.add("active");
        }
        
        // Update hash when clicked from TOC
        location.hash = "#" + sectionId;
      }
    
      setTimeout(() => {
        const element = getElementToScroll(id, sectionNumber);
        scrollToElement(element);
      }, 100);
    };

    // Highlight section while scrolling
    window.addEventListener("scroll", () => {
      if (!hash) {
        checkVisibleSection();
      }
    });

  }, []);

  // Extract base ID and section number from sectionId
  const extractIdAndSection = (sectionId, unique) => {
    let id, sectionNumber;

    if (unique) {
      id = sectionId;
    } else {
      const match = sectionId.match(/(?<id>(?:\w|-)+)-(?<count>\d+)$/);
      if (match) {
        id = match.groups.id;
        sectionNumber = match.groups.count;
      } else {
        id = sectionId;
        sectionNumber = undefined;
      }
    }

    return { id, sectionNumber };
  };

  // Get the element to scroll to based on the base ID and section number
  const getElementToScroll = (id, sectionNumber) => {
    const elements = document.querySelectorAll(`#${id}`);
    if (elements.length === 0) return null;

    if (sectionNumber === undefined) {
      return elements[0];
    } else {
      return elements[sectionNumber];
    }
  };

  // Scroll to the target element
  const scrollToElement = (element) => {
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Check which section is visible and highlight the corresponding TOC item
  function checkVisibleSection() {
    let nav = document.getElementById("markdown-navigation"),
      sections = document.querySelectorAll(".section"),
      section = null;
  
    // Set a smaller threshold (reduce from window.innerHeight to a smaller value like 100)
    let threshold = 100;
  
    // Iterate over each section to find the one closest to the top
    [].forEach.call(sections, (item) => {
      let offset = item.getBoundingClientRect();
      if (offset.top >= 0 && offset.top < threshold) {
        section = item;
      }
    });
  
    // If a section is found that matches the threshold criteria, highlight it in TOC
    if (section) {
      let sectionName = section.dataset.section,
        similarSections = Array.prototype.slice.call(
          document.querySelectorAll(
            '.mdContent [data-section="' + sectionName + '"]'
          )
        ),
        index = similarSections.indexOf(section),
        link = nav.querySelector(
          `[data-section="${sectionName}${index > 0 ? `-${index}` : ""}"]`
        );
  
      // Update the TOC highlighting
      if (!link.classList.contains("active")) {
        nav.querySelector("div.active").classList.remove("active");
        link.classList.add("active");
      }
    }
  }
  

  // Generate TOC items dynamically
  const getArrayCount = (array, value) => {
    return array.filter((item) => item === value).length;
  };

  const NavGen = (count, source) => {
    const [data, setData] = React.useState({});

    const fetchData = React.useCallback(async () => {
      const file = await unified()
        .use(remarkParse)
        .use(remarkHtml)
        .process(source);

      let level = "",
        text = "",
        sectionId = "",
        unique = true;

      const match = String(file).match(/h(\d)/);
      if (match.length > 1) {
        const headingLevel = match[1];

        if (headingLevel > 0 && headingLevel < 7) {
          level = `title-level${headingLevel}`;
          text = String(file)
            .match(/<h\d>(.*?)<\/h\d>/g)
            .map(function (val) {
              return val.replace(/<\/?h\d>/g, "");
            });
        }
      }

      sectionId = String(text)
        .replace(/<code>/g, "")
        .replace(/<\/code>/g, "")
        .replace(/[&\/\\#,+()!$~%.'’":*?<>{}]/g, "")
        .replace(/x26;/g, "")
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/x3c;/g, "");

      const headingCount = getArrayCount(uniqueHeadingList, sectionId);
      uniqueHeadingList.push(sectionId);
      if (headingCount !== 0) {
        unique = false;
        sectionId = sectionId + "-" + headingCount;
      }

      const myObj = {
        level,
        text,
        sectionId,
        active: count === 1 ? true : false,
        unique,
      };

      setData(myObj);
    }, [count, source]);

    React.useEffect(() => {
      fetchData().catch(console.error);
    }, [fetchData]);

    return data;
  };

  function z(content) {
    const myArray = content.split("\n");

    let titleCount = 0,
      codeBlockFound = false;
    let newArray = myArray.map((value) => {
      if (value.match(/^\s*```/)) {
        codeBlockFound = !codeBlockFound;
      }
      if (value.match(/^#/) && !codeBlockFound) {
        titleCount++;
        return NavGen(titleCount, value);
      }
    });

    newArray = newArray.filter(function (element) {
      return element !== undefined;
    });
    return newArray;
  }

  return (
    <>
      <div id="markdown-navigation" className="markdown-navigation">
        {z(source).map((item) => (
          <div
            key={item.sectionId}
            data-section={item.sectionId}
            className={`title-anchor ${item.level}${item.active ? " active" : ""}`}
            onClick={(e) => clickMe(e.target, item.sectionId, item.unique)}
            dangerouslySetInnerHTML={{ __html: item.text }}
          />
        ))}
      </div>
    </>
  );
}
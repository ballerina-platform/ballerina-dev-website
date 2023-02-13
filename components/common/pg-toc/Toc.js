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

  const clickMe = (triggerElement, sectionId, unique) => {
    if (triggerElement.tagName.toLowerCase() === "code")
      triggerElement = triggerElement.parentElement;

    let id, sectionNumber;

    if (unique) {
      id = sectionId;
    } else {
      const match = sectionId.match(/(?<id>(?:\w|-)+)-(?<count>\d+)$/);
      id = match.groups.id;
      sectionNumber = match.groups.count;
    }

    const elements = document.querySelectorAll(`#${id}`);
    let element;

    if (sectionNumber == undefined) {
      element = elements[0];
    } else {
      element = elements[sectionNumber];
    }

    const tocItems = document.querySelectorAll(".title-anchor");
    tocItems.forEach(function (el) {
      el.classList.remove("active");
    });

    triggerElement.classList.add("active");
    location.hash = "#" + sectionId;
    element.scrollIntoView();
  };

  //Highlight toc on scroll
  React.useEffect(() => {
    window.addEventListener("hashchange", () => {
      hash = true;
      setTimeout(() => (hash = false), 1000);
    });
    window.addEventListener("scroll", () => {
      if (!hash) {
        checkVisibleSection();
      }
    });
  }, []);

  //---Check the visible section
  function checkVisibleSection() {
    let nav = document.getElementById("markdown-navigation"),
      sections = document.querySelectorAll(".section"),
      minor = window.innerHeight,
      section = null;

    //---Select the section closest to the top
    [].forEach.call(sections, (item) => {
      let offset = item.getBoundingClientRect();
      if (Math.abs(offset.top) < minor + 25) {
        minor = Math.abs(offset.top);
        section = item;
      }
    });

    //---If the section exists
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

      //---If the link is not already active
      if (!link.classList.contains("active")) {
        //---Remove the active class
        nav.querySelector("div.active").classList.remove("active");

        //---Add the active class
        link.classList.add("active");
      }
    }
  }

  // get the count of an element in an array
  const getArrayCount = (array, value) => {
    return array.filter((item) => item === value).length;
  };

  const NavGen = (count, source) => {
    const [data, setData] = React.useState({});

    // declare the async data fetching function
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

    // the useEffect is only there to call `fetchData` at the right time
    React.useEffect(() => {
      fetchData()
        // make sure to catch any error
        .catch(console.error);
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
            className={`title-anchor ${item.level}${
              item.active ? " active" : ""
            }`}
            onClick={(e) => clickMe(e.target, item.sectionId, item.unique)}
            dangerouslySetInnerHTML={{ __html: item.text }}
          />
        ))}
      </div>
    </>
  );
}

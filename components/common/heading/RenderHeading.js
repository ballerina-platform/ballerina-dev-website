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

import React from "react";

// Add id attributes to headings
const extractText = (value) => {
  if (typeof value === "string") {
    return value;
  } else {
    return value.props.children;
  }
};

const scanArray = (array) => {
  const newArray = array.map(extractText);
  let newId = newArray
    .join("")
    .replace(/[&\/\\#,+()!$~%.'’":*?<>{}]/g, "")
    .toLowerCase();
  newId = newId.replace(/ /g, "-");
  return newId;
};

const getLink = (element, id) => {
  if (element.tagName.toLowerCase() === "path") element = element.parentElement;

  const elementNodeList = document.querySelectorAll(`#${id}`);
  const elementArray = Array.prototype.slice.call(elementNodeList);
  const count = elementArray.indexOf(element.parentElement);

  if (count === 0) {
    location.hash = `#${id}`;
  } else {
    location.hash = `#${id}-${count}`;
  }

  navigator.clipboard.writeText(window.location.href);
  element.parentElement.scrollIntoView();
};

function Heading(level, children, setShowToc) {
  const id =
    Array.isArray(children) && children.length === 1
      ? children[0]
          .toLowerCase()
          .replace(/[&\/\\#,+()!$~%.'’":*?<>{}]/g, "")
          .replace(/ /g, "-")
      : scanArray(children);

  setShowToc(true);
  
  const handleLinkClick = (e) => getLink(e.target, id);

  return React.createElement(
    `h${level}`,
    { id, "data-section": id, className: "section" },
    React.createElement(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        width: "30",
        height: "30",
        fill: "currentColor",
        className: "bi bi-link-45deg mdButton pe-2",
        viewBox: "0 0 16 16",
        onClick: handleLinkClick,
      },
      React.createElement("path", {
        d: "M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z",
      }),
      React.createElement("path", {
        d: "M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z",
      })
    ),
    children
  );
}

export default function GenerateHeadingComponent(level, setShowToc) {
  return ({ children }) => Heading(level, children, setShowToc);
}

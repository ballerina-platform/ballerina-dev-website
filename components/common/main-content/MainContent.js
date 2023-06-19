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
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

String.prototype.hashCode = function () {
  var hash = 0,
    i, chr;
  if (this.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
    chr = this.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0;
  }
  return hash;
}

export default function MainContent(props) {

  const content = props.content;
  const codes = props.codes ? new Map(JSON.parse(props.codes)) : new Map();

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
    if (element.tagName.toLowerCase() === "path")
      element = element.parentElement;

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

  const toc = (show) => {
    props.handleToc(show)
  }

  return (

    <ReactMarkdown
      components={{
        h2({ node, inline, className, children, ...props }) {
          let id = "";
          toc(true);
          if (children.length === 1) {
            id = children[0]
              .toString()
              .toLowerCase()
              .replace(/[&\/\\#,+()!$~%.'’":*?<>{}]/g, "")
              .replace(/ /g, "-");
          } else {
            id = scanArray(children);
          }
          return (
            <h2 id={id} data-section={id} className="section">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                fill="currentColor"
                className="bi bi-link-45deg mdButton pe-2"
                viewBox="0 0 16 16"
                onClick={(e) => getLink(e.target, id)}
              >
                <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
              </svg>
              {children}
            </h2>
          );
        },
        h3({ node, inline, className, children, ...props }) {
          let id = "";
          toc(true);
          if (children.length === 1) {
            id = children[0]
              .toString()
              .toLowerCase()
              .replace(/[&\/\\#,+()!$~%.'’":*?<>{}]/g, "")
              .replace(/ /g, "-");
          } else {
            id = scanArray(children);
          }
          return (
            <h3 id={id} data-section={id} className="section">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                fill="currentColor"
                className="bi bi-link-45deg mdButton pe-2"
                viewBox="0 0 16 16"
                onClick={(e) => getLink(e.target, id)}
              >
                <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
              </svg>
              {children}
            </h3>
          );
        },
        h4({ node, inline, className, children, ...props }) {
          let id = "";
          toc(true);
          if (children.length === 1) {
            id = children[0]
              .toString()
              .toLowerCase()
              .replace(/[&\/\\#,+()!$~%.'’":*?<>{}]/g, "")
              .replace(/ /g, "-");
          } else {
            id = scanArray(children);
          }
          return (
            <h4 id={id} data-section={id} className="section">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                fill="currentColor"
                className="bi bi-link-45deg mdButton pe-2"
                viewBox="0 0 16 16"
                onClick={(e) => getLink(e.target, id)}
              >
                <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
              </svg>
              {children}
            </h4>
          );
        },
        h5({ node, inline, className, children, ...props }) {
          let id = "";
          toc(true);
          if (children.length === 1) {
            id = children[0]
              .toString()
              .toLowerCase()
              .replace(/[&\/\\#,+()!$~%.'’":*?<>{}]/g, "")
              .replace(/ /g, "-");
          } else {
            id = scanArray(children);
          }
          return (
            <h5 id={id} data-section={id} className="section">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                fill="currentColor"
                className="bi bi-link-45deg mdButton pe-2"
                viewBox="0 0 16 16"
                onClick={(e) => getLink(e.target, id)}
              >
                <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
              </svg>
              {children}
            </h5>
          );
        },
        h6({ node, inline, className, children, ...props }) {
          let id = "";
          toc(true);
          if (children.length === 1) {
            id = children[0]
              .toString()
              .toLowerCase()
              .replace(/[&\/\\#,+()!$~%.'’":*?<>{}]/g, "")
              .replace(/ /g, "-");
          } else {
            id = scanArray(children);
          }
          return (
            <h6 id={id} data-section={id} className="section">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                fill="currentColor"
                className="bi bi-link-45deg mdButton pe-2"
                viewBox="0 0 16 16"
                onClick={(e) => getLink(e.target, id)}
              >
                <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
              </svg>
              {children}
            </h6>
          );
        },
        code({ node, inline, className, children, ...props }) {
          if (typeof children[0] === 'string') {
            const key = (children[0]).trim().split(/\r?\n/).map(row => row.trim()).join('\n');
            const highlightedCode = codes.get(key.hashCode());
            if (highlightedCode) {
              return <div dangerouslySetInnerHTML={{ __html: highlightedCode }} />
            }
          }

          const match = /language-(\w+)/.exec(className || '')
          return inline ?
            <code className={className} {...props}>
              {children}
            </code>
            : match ?
              <div dangerouslySetInnerHTML={{ __html: String(children).replace(/\n$/, '') }} />
              : <pre className='default'>
                <code className={className} {...props}>
                  {children}
                </code>
              </pre>
        },
        table({node, className, children, ...props}) { 
          return <div className='mdTable'><table {...props}>{children}</table></div>
        }
      }}
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
    >
      {content}
    </ReactMarkdown>
  );
}

/**
 * Copyright (c) 2022, WSO2 LLC. (http://www.wso2.com) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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
import DOMPurify from 'isomorphic-dompurify';
import { getHighlighter, setCDN } from "shiki";

setCDN("https://unpkg.com/shiki/");


export default function HighlightSyntax(props) {

    const codeSnippet = props.codeSnippet;
    const lang = props.lang;

    // Apply shiki theming
    const ApplyShiki = (code, language) => {
        const [codeSnippet, setCodeSnippet] = React.useState([]);
        if (language == "proto" || language == "openapi") {
            language = "ballerina";
        }

        if (language == "yml") {
            language = "yaml";
        }
        React.useEffect(() => {
            let isMounted = true;
            async function fetchData() {
                getHighlighter({
                    theme: "github-light",
                    langs: [
                        "bash",
                        "ballerina",
                        "toml",
                        "yaml",
                        "sh",
                        "json",
                        "graphql",
                        "sql",
                        "java",
                        "groovy"
                    ],

                }).then((highlighter) => {
                    if (isMounted) {
                        setCodeSnippet(highlighter.codeToHtml(code, language));
                    }
                });
            }
            fetchData();
        }, [code, language]);

        return [codeSnippet];
    };

    return (
        <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(ApplyShiki(codeSnippet, lang)) }} />
    );
}

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

// import algoliasearch and InstantSearch
import * as React from 'react';
// import algoliasearch from "algoliasearch/lite";
// import { Container, Nav, Navbar, NavDropdown, Form, FormControl, Button, Modal} from 'react-bootstrap';
// import { InstantSearch } from "react-instantsearch-dom";
// import SearchBox from "./search-box/SearchBox";
// import Hits from "./search-hits/SearchHits";

export default function Search() {

    // Initialize the Algolia client
    // const searchClient = algoliasearch(
    //     process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
    //     process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY,
    // )

    React.useEffect(() => {

        async function fetchData() {
            docsearch({
                container: '.algolia-search-cont',
                appId: process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
                apiKey: process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY,
                indexName: 'ballerina_pre', // it does not change
                searchParameters: {
                    hitsPerPage: 1000
                },
            });
        }
        fetchData();
    });

    return (
        <>
            {/* <InstantSearch
                searchClient={searchClient} // this is the Algolia client
                indexName="ballerina" // this is your index name
            >
                <SearchBox />

                <Hits />
            </InstantSearch> */}


            <div className="algolia-search-cont">
                <div className="algolia-search-wrap form-control">
                    <span
                        className="glyphicon glyphicon-search search-icon"
                        aria-hidden="true"
                    ></span>
                    <input
                        autoCapitalize="off"
                        autoComplete="off"
                        autoCorrect="off"
                        placeholder="Search..."
                        role="textbox"
                        spellCheck="false"
                        type="text"
                        defaultValue=""
                        className="algolia-search-box"
                        id="algolia-search-box"
                    />
                </div>
            </div>
        </>
    )
}


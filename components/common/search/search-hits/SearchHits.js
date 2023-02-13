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

import { connectStateResults } from "react-instantsearch-dom";

import styles from './SearchHits.module.css';

function SearchHits({ searchState, searchResults }) {
    const validQuery = searchState.query?.length >= 3 // 3 is the minimum query length

    return (
        <>
            {searchResults?.hits.length === 0 && validQuery && (
                <p>No results found!</p>
            )}

            {searchResults?.hits.length > 0 && validQuery && (
                <>
                    {searchResults.hits.map((hit, index) => (
                        (hit.hierarchy.lvl0 === null) ?
                            <a href={hit.url} className={styles.hit}>
                                <div tabIndex={index} 
                                    key={hit.objectID} 
                                    className={styles.hitBody}
                                    dangerouslySetInnerHTML={{__html: hit._highlightResult.hierarchy.lvl1.value}} />
                            </a>
                        : (hit._highlightResult.hierarchy.lvl1) ? 
                            <div>
                                <p className={styles.hitCategory}>
                                        {hit.hierarchy.lvl0}
                                </p>
                                <a href={hit.url} className={styles.hit}>
                                    <div tabIndex={index} 
                                        key={hit.objectID} 
                                        className={styles.hitBody}
                                        dangerouslySetInnerHTML={{__html: hit._highlightResult.hierarchy.lvl1.value}} />
                                </a>
                            </div>
                            :null
                    ))}
                </>
            )}
        </>
    )
}

export default connectStateResults(SearchHits)



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



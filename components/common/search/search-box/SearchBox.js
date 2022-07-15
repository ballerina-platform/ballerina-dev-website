// import connectSearchBox
import { connectSearchBox } from "react-instantsearch-dom";
import styles from './SearchBox.module.css';

function SearchBox({ refine }) {
    return (
        <>
            <input
                id="algolia_search"
                type="search"
                placeholder="Search docs"
                onChange={(e) => refine(e.currentTarget.value)}
                className={styles.searchBox}
                autoFocus
            />
        </>
    )
}

export default connectSearchBox(SearchBox)
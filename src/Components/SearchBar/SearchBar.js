import React from 'react';
import './SearchBar.css';

class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {term: ''};
        this.search = this.search.bind(this);
        this.handleTermChange = this.handleTermChange.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
    };

    search() {
        this.props.onSearch(this.state.term);
    };

    handleTermChange(event) {
        this.setState({term: event.target.value});
    };

    handleKeyDown(event) {
        if (event.key === 'Enter') {
            this.search();
        }
<<<<<<< HEAD
    }
=======
    };
>>>>>>> 781d5b0be7dfe14fb9cb26915c43ec552a2b8e29

    render() {
        return (
            <div className="SearchBar">
                <input placeholder="Enter A Song, Album, or Artist" onChange={this.handleTermChange} type="search" onKeyDown={this.handleKeyDown}/>
                <button className="SearchButton" onClick={this.search}>SEARCH</button>
            </div>
        )}
};

export default SearchBar;
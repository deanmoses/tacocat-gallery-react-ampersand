/** @jsx React.DOM */
'use strict';

/**
 * React.js components to handle Search
 */

var Site = require('./site.jsx');
var Thumb = require('./thumb.jsx');
var React = require('react');
var ReactDOM = require('react-dom');
var PropTypes = require('prop-types');
var $ = require('jquery');

/**
 * The React.js component that renders the search screen.
 *
 * This is the only component in this module that is exported:
 * it's called by the router to render an album.
 */
class SearchPage extends React.Component {

	/**
	 * Invoked after the component is mounted into the DOM.
	 *
	 * Invoked once, immediately after the initial rendering occurs.
	 * At this point in the lifecycle, the component has a DOM
	 * representation which you can access via this.getDOMNode().
	 *
	 * This is the place to send AJAX requests.
	 */
	componentDidMount() {
		// if the component was created with search terms, ask server to search
		if (this.props.searchTerms) {
			var url = 'https://tacocat.com/zenphoto/page/search?words=' + encodeURIComponent(this.props.searchTerms) +'&api';
			$.getJSON(url)
			.done(function(results) {
				this.setState({
					results: results
				});
			}.bind(this))
			.fail(function(err) {
				this.setState({
					err: err
				});
			}.bind(this));
		}
	}

	render() {
		// No state = no search results
		if (!this.state) {
			// Tabula rasa: search screen, ready to type a search query into
			if (!this.props.searchTerms) {
				return (
					<SearchPageShell searchTerms={this.props.searchTerms} returnPath={this.props.returnPath} />
				);
			}
			// Else search terms have been typed in.  Show waiting page
			else {
				return (
					<WaitingPage searchTerms={this.props.searchTerms} returnPath={this.props.returnPath} />
				);
			}
		}
		// Else there's state, meaning a search has been done
		else {
			// Error result
			if (this.state.err) {
				return (
					<ErrorPage searchTerms={this.props.searchTerms} returnPath={this.props.returnPath} err={this.state.err} />
				);
			}
			// Else if successful results
			else if (this.state.results) {
				// No images or albums in results: show no search results page
				if (!this.state.results.images && !this.state.results.albums) {
					return(
						<NoResultsPage searchTerms={this.props.searchTerms} returnPath={this.props.returnPath} />
					);
				}
				else {
					var images = '';
					var albums = '';
					if (this.state.results.images) {
						images = <Thumb.List items={this.state.results.images} useLongDateAsSummary={true}/>;
					}
					if (this.state.results.albums) {
						albums = <Thumb.List items={this.state.results.albums} useLongDateAsTitle={true}/>;
					}
					return (
						<ResultsPage searchTerms={this.props.searchTerms} returnPath={this.props.returnPath} images={images} albums={albums} />
					);
				}
			}
		}
	}
}
SearchPage.propTypes = {
   // search terms like 'cat dog puppy'
   searchTerms: PropTypes.string,
   // URL to return to, like when clicking back button
   returnPath: PropTypes.string
};
module.exports = SearchPage;

/**
 * The React.js component that renders the shell of the search screen.
 */
class SearchPageShell extends React.Component {
	/**
     * Constructor is invoked once, before the component is mounted
     */
    constructor(props) {
        super(props);

		// The following line is needed so the 'this' is scoped to this 
		// class when the user clicks and handleSearch() is invoked.
		this.handleSearch = this.handleSearch.bind(this);
	}
	
	render() {
		var returnUrl = (this.props.returnPath) ? encodeURIComponent(this.props.returnPath) : '';
		return (
            <Site.Page hideFooter={true}>
                <nav className='header navbar'>
                    <div className='navbar-header'>
                        <a className='navbar-brand' href={'#'+returnUrl}><Site.GlyphIcon glyph='circle-arrow-left'/></a>
                    </div>
                    <div className='header-controls search-form'>
                        <form onSubmit={this.handleSearch} className=''>
                            <input type='text' placeholder='search' defaultValue={this.props.searchTerms} ref='searchBox' autoFocus/>
                            <button type='submit' className='btn btn-default btn-sm'>Search</button>
                        </form>
                    </div>
                </nav>
				{this.props.children}
            </Site.Page>
		);
	}

	/**
     * Handle the user submitting the search form
     * by setting the new search terms on the URL.
     *
     * The actual searching will be done when the
     * component is re-rendered because of the URL change.
     */
    handleSearch(e) {
		e.preventDefault();
        var search = 'search:' + encodeURIComponent(ReactDOM.findDOMNode(this.refs.searchBox).value.trim());
        var returnPath = (this.props.returnPath) ? '&return:' + encodeURIComponent(this.props.returnPath) : '';
        window.location.hash = search + returnPath;
    }
}
SearchPageShell.propTypes = {
	// Search terms like 'cat dog puppy'
	searchTerms: PropTypes.string,
	// Path to return to, like when clicking back button
	returnPath: PropTypes.string
};

/**
 * The React.js component to render while waiting for the search results
 */
class WaitingPage extends React.Component {
	render() {
		return (
			<SearchPageShell searchTerms={this.props.searchTerms} returnPath={this.props.returnPath}>
				<div className='fullPageMessage'>
					<p>Searching...</p>
					<p><Site.WaitingSpinner /></p>
				</div>
			</SearchPageShell>
		);
	}
}
SearchPageShell.propTypes = {
	// Search terms like 'cat dog puppy'
	searchTerms: PropTypes.string,
	// Path to return to, like when clicking back button
	returnPath: PropTypes.string
};

/**
 * The React.js component Search Error page
 */
class ErrorPage extends React.Component {
	render() {
		return (
			<SearchPageShell searchTerms={this.props.searchTerms} returnPath={this.props.returnPath}>
				<div className='fullPageMessage'>
					<p>There was an error searching.</p>
					<p>Reload the page and try again.</p>
				</div>
			</SearchPageShell>
		);
	}
}
ErrorPage.propTypes = {
	// Search terms like 'cat dog puppy'
	searchTerms: PropTypes.string,
	// Path to return to, like when clicking back button
	returnPath: PropTypes.string,
	// The error object
	err: PropTypes.object.isRequired
};

/**
 * The React.js component that renders the 'No Results' page
 */
class NoResultsPage extends React.Component {
	render() {
		return (
			<SearchPageShell searchTerms={this.props.searchTerms} returnPath={this.props.returnPath}>
				<div className='fullPageMessage'>
					<p>Didn't find anything matching '{this.props.searchTerms}'</p>
				</div>
			</SearchPageShell>
		);
	}
}
NoResultsPage.propTypes = {
	// Search terms like 'cat dog puppy'
	searchTerms: PropTypes.string,
	// Path to return to, like when clicking back button
	returnPath: PropTypes.string
};

 /**
 * The React.js component that renders the search results page
 */
class ResultsPage extends React.Component {
	render() {
		return (
			<SearchPageShell searchTerms={this.props.searchTerms} returnPath={this.props.returnPath}>
				{this.props.images}
				{this.props.albums}
			</SearchPageShell>
		);
	}
}
ResultsPage.propTypes = {
	// Search terms like 'cat dog puppy'
	searchTerms: PropTypes.string,
	// Path to return to, like when clicking back button
	returnPath: PropTypes.string,
	images: PropTypes.element,
	albums: PropTypes.element
};
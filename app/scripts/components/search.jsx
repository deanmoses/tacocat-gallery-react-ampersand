/** @jsx React.DOM */
'use strict';

var Site = require('./site.jsx');
var Thumb = require('./thumb.jsx');
var React = window.React = require('react');
var $ = require('jquery');

/**
 * The React.js component that renders the search screen.
 *
 * This is the only component in this module that is exported:
 * it's called by the router to render an album.
 */
var SearchPage;
module.exports = SearchPage = React.createClass({
	
	/**
	 * Declare the properties that this component takes
	 */
	propTypes: {
		// search terms like 'cat dog puppy'
	    searchTerms: React.PropTypes.string,
		// URL to return to, like when clicking back button
		returnPath: React.PropTypes.string
	},
	
	/**
	 * Invoked after the component is mounted into the DOM.
	 *
	 * Invoked once, immediately after the initial rendering occurs. 
	 * At this point in the lifecycle, the component has a DOM 
	 * representation which you can access via this.getDOMNode().
	 *
	 * This is the place to send AJAX requests.
	 */
	componentDidMount: function() {		
		// if the component was created with search terms, ask server to search
		if (this.props.searchTerms) {
			var url = 'http://tacocat.com/zenphoto/page/search?words=' + encodeURIComponent(this.props.searchTerms) +'&api';
			$.getJSON(url)
			.done(function(results) {
				//console.log('results: ', results);
				if (this.isMounted()) {
					this.setState({
						results: results
					});
				}
			}.bind(this))
			.fail(function(x) {
				console.log('error retrieving search: ', x);
			});
		}
	},
	
	render: function() {
		var images = '';
		var albums = '';
		var noResults = '';
		if (this.state && this.state.results) {
			if (this.state.results.images) {
				images = <Thumb.List items={this.state.results.images}/>;
			}
			if (this.state.results.albums) {
				albums = <Thumb.List items={this.state.results.albums}/>;
			}
		}
		if (this.props.searchTerms && this.state && !images && !albums) {
			noResults = <div className='noresults'>No results</div>;
		}
		var returnUrl = (this.props.returnPath) ? encodeURIComponent(this.props.returnPath) : '';
		return (
			<div>
				<a href={'#'+returnUrl}><Site.GlyphIcon glyph='circle-arrow-left'/></a>
				<SearchBox searchTerms={this.props.searchTerms} returnPath={this.props.returnPath} />
				{images}
				{albums}
				{noResults}
			</div>
		);
	}
});


/**
 * Component that renders the search box 
 * and handles retrieving user input from it.
 */
var SearchBox = React.createClass({
	
	/**
	 * Declare the properties that this component takes
	 */
	propTypes: {
		// search terms like 'cat dog puppy'
	    searchTerms: React.PropTypes.string,
		// URL to return to, like when clicking back button
		returnPath: React.PropTypes.string
	},

	render: function() {
		return (
			<form onSubmit={this.handleSearch}>
				<input type='text' placeholder='search' defaultValue={this.props.searchTerms} ref='searchBox'/>
			</form>
		);
	},
	
	/**
	 * Handle the user submitting the search form
	 * by setting the new search terms on the URL.
	 * 
	 * The actual searching will be done when the 
	 * component is re-rendered because of the URL change.
	 */
	handleSearch: function(e) {
		e.preventDefault();
		var search = 'search:' + encodeURIComponent(this.refs.searchBox.getDOMNode().value.trim());
		var returnPath = (this.props.returnPath) ? '&return:' + encodeURIComponent(this.props.returnPath) : '';
		window.location.hash = search + returnPath;
	}	
});
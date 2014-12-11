/** @jsx React.DOM */
'use strict';

//
// React.js components that render the photo gallery site shell
// These just wrap stuff in Bootstrap HTML and classes
//

var Config = require('../config.js');
var React = require('react');

// all the components in this file will be added to Site,
// which will then be made available as a module
var Site = {};

Site.HeaderTitle = React.createClass({
    propTypes: {
        title: React.PropTypes.string,
        href: React.PropTypes.string,
        editMode: React.PropTypes.bool
    },
	render: function() {
        var title = (this.props.editMode) ?
            <input className='titleInput navbar-brand' value={this.state.title} onChange={this.titleChange} />
            : <a className='navbar-brand' href={this.props.href}>{this.props.title}</a>

		return (
			<div>
				<nav className='header navbar' role='navigation'>
                    <div className='navbar-header'>
                        {title}
                    </div>
                    <div className='nav navbar-nav navbar-right'>
                        <span className='navbar-text'><Site.SearchButton returnPath={this.props.path}/></span>
                        <span className='navbar-text site-title'>{Config.site_title}</span>
                    </div>
				</nav>
				<Site.HeaderButtons>{this.props.children}</Site.HeaderButtons>
			</div>
		);
	},
    getInitialState: function() {
        return {title: this.props.title};
    },
    titleChange: function(event) {
        this.setState({title: event.target.value});
    },
    componentDidMount: function() {
        if (this.props.editMode) {
           $('.titleInput').focus();
        }
    },
    componentDidUpdate: function(prevProps, prevState) {
        if (this.props.editMode) {
           $('.titleInput').focus();
        }
    }
});

Site.HeaderButtons = React.createClass({
	render: function() {
		if (!this.props.children) {
			return false;
		}

		return (
			<div>
				<div className='btn-group btn-group-justified' role='group'>{this.props.children}</div>
			</div>
		);
	}
});

Site.PrevButton = React.createClass({
	render: function() {
		return(
			<Site.HeaderButton href={this.props.href}>
				<Site.GlyphIcon glyph='chevron-left'/> <span className='nav-button-label'>{this.props.title}</span>
			</Site.HeaderButton>
		);
	}
});

Site.NextButton = React.createClass({
	render: function() {
		return(
			<Site.HeaderButton href={this.props.href}>
				<span className='nav-button-label'>{this.props.title}</span> <Site.GlyphIcon glyph='chevron-right'/>
			</Site.HeaderButton>
		);
	}
});

Site.UpButton = React.createClass({
	render: function() {
		return(
			<Site.HeaderButton href={this.props.href}>
			<Site.GlyphIcon glyph='home'/> <span className='nav-button-label'>{this.props.title}</span>
			</Site.HeaderButton>
		);
	}
});

Site.HeaderButton = React.createClass({
	render: function() {
		if (this.props.href) {
			return(
				<a className='btn btn-default' href={this.props.href}>{this.props.children}</a>
			);
		}
		// else render with no href
		else {
			return(
				<a className='btn btn-default disabled'>{this.props.children}</a>
			);
		}
	}
});

/**
 * Component that renders a search icon for navigating to search screen.
 */
Site.SearchButton = React.createClass({
	propTypes: {
		// search terms like 'cat dog puppy'
	    searchTerms: React.PropTypes.string,
		// URL to return to, like when clicking back button
		returnPath: React.PropTypes.string
	},
	render: function() {
		var searchUrl = '#search:';
		searchUrl += (this.props.searchTerms) ? encodeURIComponent(this.props.searchTerms) : '';
		searchUrl += '&return:';
		searchUrl += (this.props.returnPath) ? encodeURIComponent(this.props.returnPath) : '';
		return (
			<a href={searchUrl}><Site.GlyphIcon glyph='search'/></a>
		);
	}
});

Site.GlyphIcon = React.createClass({
	render: function() {
		return(
			<span className={'glyphicon glyphicon-' + this.props.glyph}/>
		);
	}
});

module.exports = Site;

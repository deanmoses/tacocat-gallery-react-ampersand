/** @jsx React.DOM */
'use strict';
/*global window*/

//
// React.js components that render the photo gallery site shell
// These just wrap stuff in Bootstrap HTML and classes
//

var Config = require('../config.js');
var React = window.React = require('react');

// all the components in this file will be added to Site, 
// which will then be made available as a module
var Site = {};

Site.HeaderTitle = React.createClass({
	render: function() {
		var siteTitle = Config.site_title;
		return (
			<div>
				<nav className='header navbar' role='navigation'>
						<div className='navbar-header'>
							<a className='navbar-brand' href={this.props.href} >
								{this.props.title}
							</a>
						</div>
						<div className='nav navbar-nav navbar-right'>
								<span className='navbar-text site-title'>{siteTitle}</span>
						</div>
				</nav>
				<Site.HeaderButtons>{this.props.children}</Site.HeaderButtons>
			</div>
		);
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

Site.GlyphIcon = React.createClass({
	render: function() {
		return(
			<span className={'glyphicon glyphicon-' + this.props.glyph}/>
		);
	}
});

module.exports = Site;
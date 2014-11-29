/** @jsx React.DOM */

//
// React.js components that render the photo gallery site shell
// These just wrap stuff in Bootstrap HTML and classes
//

var React = window.React = require('react');

var Site = {};

Site.HeaderTitle = React.createClass({
	render: function() {
		return (
			<nav className="navbar navbar-inverse navbar-fixed-top" role="navigation">
				<div className="navbar-header">
					<a href={this.props.href} className="navbar-brand">
						{this.props.title}
					</a>
				</div>
			</nav>
		);
	}
});

Site.HeaderButtons = React.createClass({
	render: function() {
		return (
			<ul className="nav navbar-nav navbar-right">{this.props.children}</ul>
		);
	}
});

Site.HeaderButton = React.createClass({
	render: function() {
		return(
			<li><a href={this.props.href} className="button">{this.props.children}</a></li>
		);
	}
});


Site.UpButton = React.createClass({
	render: function() {
		return(
			<Site.HeaderButton href={this.props.href}>
				<Site.UpIcon/> {this.props.title}
			</Site.HeaderButton>
		);
	}
});


Site.UpIcon = React.createClass({
	render: function() {
		return(
			<Site.GlyphIcon glyph="home"/>
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


Site.PrevButton = React.createClass({
	render: function() {
		return(
			<Site.Button href={this.props.href}><Site.GlyphIcon glyph="chevron-left"/> Prev</Site.Button>
		);
	}
});

Site.NextButton = React.createClass({
	render: function() {
		return(
			<Site.Button href={this.props.href}>Next <Site.GlyphIcon glyph="chevron-right"/></Site.Button>
		);
	}
});

Site.Button = React.createClass({
	render: function() {
		if (this.props.href) {
			return(
				<a className="btn btn-default" href={this.props.href}>{this.props.children}</a>
			);
		}
		// else render with no href
		else {
			return(
				<a className="btn btn-default">{this.props.children}</a>
			);
		}
	}
});

module.exports = Site;
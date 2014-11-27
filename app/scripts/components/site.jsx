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

var HeaderButtons = React.createClass({
	render: function() {
		return (
			<ul className="nav navbar-nav navbar-right">{this.props.children}</ul>
		);
	}
});

var HeaderButton = React.createClass({
	render: function() {
		return(
			<li><a href={this.props.href} className="button">{this.props.children}</a></li>
		);
	}
});


var UpButton = React.createClass({
	render: function() {
		return(
			<HeaderButton href={this.props.href}>
				<UpIcon/> {this.props.title}
			</HeaderButton>
		);
	}
});


var UpIcon = React.createClass({
	render: function() {
		return(
			<GlyphIcon glyph="home"/>
		);
	}
});


var GlyphIcon = React.createClass({
	render: function() {
		return(
			<span className={'glyphicon glyphicon-' + this.props.glyph}/>
		);
	}
});


var PrevButton = React.createClass({
	render: function() {
		return(
			<Button href={this.props.href}><GlyphIcon glyph="chevron-left"/> Prev</Button>
		);
	}
});

var NextButton = React.createClass({
	render: function() {
		return(
			<Button href={this.props.href}>Next <GlyphIcon glyph="chevron-right"/></Button>
		);
	}
});

var Button = React.createClass({
	render: function() {
		return(
			<a className="btn btn-default" href={this.props.href}>{this.props.children}</a>
		);
	}
});

module.exports = Site;
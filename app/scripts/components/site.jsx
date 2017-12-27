/** @jsx React.DOM */
'use strict';

//
// These React.js components render the photo gallery site shell
// These just wrap stuff in Bootstrap HTML and classes
//

var Config = require('../config.js');
var $ = require('jquery');
var React = require('react');
var PropTypes = require('prop-types');

// all the components in this file will be added to Site,
// which will then be made available as a module
var Site = {};

class Page extends React.Component {
    render() {
        var classes = 'pagecontents';
        if (this.props.className) {
            classes += ' ' + this.props.className;
        }
        return (
            <div>
                <div className={classes}>
                    {this.props.children}
                </div>
                {!!this.props.hideFooter ? '' : <div className='footer hidden-xs hidden-sm'><img src='images/tacocat-logo.png' width='102px' height='19px'/></div>}
            </div>
        );
    }
};
Page.propTypes = {
	className: PropTypes.string,
	hideFooter: PropTypes.bool
};
Site.Page = Page;

class HeaderTitle extends React.Component {

    /**
     * Constructor is invoked once, before the component is mounted
     */
    constructor(props) {
        super(props);

        // Initial state of the component
        this.state = {
            title: this.props.title
        };
    }

	render() {
        var title;
        if (this.props.editMode) {
            title = <span className='titleInput navbar-brand' onChange={this.titleChange} contentEditable='true'>{this.state.title}</span>;
        }
        else if (this.props.noTitleLink) {
            if (this.props.shortTitle) {
                title = <span><span className='titleInput navbar-brand hidden-xs'>{this.state.title}</span><span className='titleInput navbar-brand visible-xs'>{this.props.shortTitle}</span></span>;
            }
            else {
                title = <span className='titleInput navbar-brand'>{this.state.title}</span>;
            }
        }
        else {
            title = <a className='navbar-brand' href={this.props.href}>{this.props.title}</a>;
        }

		return (
			<div>
				<nav className='header navbar' role='navigation'>
                    <div className='navbar-header'>
                        {title}
                    </div>
                    <div className='header-controls hidden-xxs'>
                        {(!!this.props.hideSiteTitle) ? '' : <span className='hidden-xs site-title'>{Config.site_title}</span>}
                        {(!!this.props.hideSearch) ? '' : <span className='search-button'><Site.SearchButton returnPath={this.props.path}/></span>}
                    </div>
				</nav>
				<Site.HeaderButtons>{this.props.children}</Site.HeaderButtons>
			</div>
		);
	}
	
    titleChange(event) {
        this.setState({title: event.target.value});
	}
	
    componentDidMount() {
        if (this.props.editMode) {
           $('.titleInput').focus();
        }
	}
	
    componentDidUpdate(/*prevProps, prevState*/) {
        if (this.props.editMode) {
           $('.titleInput').focus();
        }
    }
};
HeaderTitle.propTypes = {
	title: PropTypes.string,
	shortTitle: PropTypes.string, // alternate title to use when screen is very narrow
	href: PropTypes.string,
	editMode: PropTypes.bool,
	noTitleLink: PropTypes.bool,
	hideSiteTitle: PropTypes.bool,
	hideSearch: PropTypes.bool
};
Site.HeaderTitle = HeaderTitle;

class HeaderButtons extends React.Component {
	render() {
		if (!this.props.children) {
			return false;
		}

		return (
			<div>
				<div className='btn-group btn-group-justified' role='group'>{this.props.children}</div>
			</div>
		);
	}
};
Site.HeaderButtons = HeaderButtons;

class PrevButton extends React.Component {
	render() {
		return(
			<Site.HeaderButton href={this.props.href}>
				<Site.GlyphIcon glyph='chevron-left'/> <span className='nav-button-label'>{this.props.title}</span>
			</Site.HeaderButton>
		);
	}
};
Site.PrevButton = PrevButton;

class NextButton extends React.Component {
	render() {
		return(
			<Site.HeaderButton href={this.props.href}>
				<span className='nav-button-label'>{this.props.title}</span> <Site.GlyphIcon glyph='chevron-right'/>
			</Site.HeaderButton>
		);
	}
};
Site.NextButton = NextButton;

class UpButton extends React.Component {
	render() {
		return(
			<Site.HeaderButton href={this.props.href}>
			<Site.GlyphIcon glyph='home'/> <span className='nav-button-label'>{this.props.title}</span>
			</Site.HeaderButton>
		);
	}
};
Site.UpButton = UpButton;

class HeaderButton extends React.Component {
	render() {
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
};
Site.HeaderButton = HeaderButton;

/**
 * Component that renders a search icon for navigating to search screen.
 */
class SearchButton extends React.Component {
	render() {
		var searchUrl = '#search:';
		searchUrl += (this.props.searchTerms) ? encodeURIComponent(this.props.searchTerms) : '';
		searchUrl += '&return:';
		searchUrl += (this.props.returnPath) ? encodeURIComponent(this.props.returnPath) : '';
		return (
			<a href={searchUrl}><Site.GlyphIcon glyph='search'/></a>
		);
	}
};
HeaderTitle.propTypes = {
	// search terms like 'cat dog puppy'
	searchTerms: PropTypes.string,
	// URL to return to, like when clicking back button
	returnPath: PropTypes.string
}
Site.SearchButton = SearchButton;

class GlyphIcon extends React.Component {
	render() {
		return(
			<span className={'glyphicon glyphicon-' + this.props.glyph} onClick={this.click}/>
		);
	}

    click(x) {
        if (this && this.props.onClick) {
            this.props.onClick(x);
        }
    }
};
Site.GlyphIcon = GlyphIcon;

module.exports = Site;
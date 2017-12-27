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
}
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
}
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
}
Site.HeaderButtons = HeaderButtons;

class PrevButton extends React.Component {
	render() {
		return(
			<Site.HeaderButton href={this.props.href}>
				<Site.GlyphIcon glyph='chevron-left'/> <span className='nav-button-label'>{this.props.title}</span>
			</Site.HeaderButton>
		);
	}
}
Site.PrevButton = PrevButton;

class NextButton extends React.Component {
	render() {
		return(
			<Site.HeaderButton href={this.props.href}>
				<span className='nav-button-label'>{this.props.title}</span> <Site.GlyphIcon glyph='chevron-right'/>
			</Site.HeaderButton>
		);
	}
}
Site.NextButton = NextButton;

class UpButton extends React.Component {
	render() {
		return(
			<Site.HeaderButton href={this.props.href}>
			<Site.GlyphIcon glyph='home'/> <span className='nav-button-label'>{this.props.title}</span>
			</Site.HeaderButton>
		);
	}
}
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
}
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
}
HeaderTitle.propTypes = {
	// search terms like 'cat dog puppy'
	searchTerms: PropTypes.string,
	// URL to return to, like when clicking back button
	returnPath: PropTypes.string
};
Site.SearchButton = SearchButton;

/**
 * Wrapper around Bootstrap CSS icons
 */
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
}
Site.GlyphIcon = GlyphIcon;

/**
 * Waiting spinner, while pages load
 */
class WaitingSpinner extends React.Component {
	render() {
		return (
			<svg className="lds-camera" width="200px"  height="200px"  xmlns="http://www.w3.org/2000/svg" 
			xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" 
			style={{background: 'none'}}>
				<g transform="translate(50,50)">
					<g transform="scale(0.8)">
						<g transform="translate(-50,-50)">
							<g transform="rotate(336.033 50 50)">
								<animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" values="360 50 50;0 50 50" keyTimes="0;1" dur="4.5s" keySplines="0.5 0.5 0.5 0.5" calcMode="spline"></animateTransform>
								<path fill="#e15b64" d="M54.3,28.1h34.2c-4.5-9.3-12.4-16.7-21.9-20.8L45.7,28.1L54.3,28.1L54.3,28.1z"></path>
								<path fill="#f47e60" d="M61.7,7.3C51.9,4,41.1,4.2,31.5,8.1v29.5l6.1-6.1L61.7,7.3C61.7,7.3,61.7,7.3,61.7,7.3z"></path>
								<path fill="#f8b26a" d="M28.1,11.6c-9.3,4.5-16.7,12.4-20.8,21.9l20.8,20.8v-8.6L28.1,11.6C28.1,11.6,28.1,11.6,28.1,11.6z"></path>
								<path fill="#abbd81" d="M31.5,62.4L7.3,38.3c0,0,0,0,0,0C4,48.1,4.2,58.9,8.1,68.5h29.5L31.5,62.4z"></path>
								<path fill="#e15b64" d="M45.7,71.9H11.5c0,0,0,0,0,0c4.5,9.3,12.4,16.7,21.9,20.8l20.8-20.8H45.7z"></path>
								<path fill="#f47e60" d="M62.4,68.5L38.3,92.6c0,0,0,0,0,0c9.8,3.4,20.6,3.1,30.2-0.8V62.4L62.4,68.5z"></path>
								<path fill="#f8b26a" d="M71.9,45.7v8.6v34.2c0,0,0,0,0,0c9.3-4.5,16.7-12.4,20.8-21.9L71.9,45.7z"></path>
								<path fill="#abbd81" d="M91.9,31.5C91.9,31.5,91.9,31.5,91.9,31.5l-29.5,0l0,0l6.1,6.1l24.1,24.1c0,0,0,0,0,0 C96,51.9,95.8,41.1,91.9,31.5z"></path>
							</g>
						</g>
					</g>
				</g>
			</svg>
		);
	}
}
Site.WaitingSpinner = WaitingSpinner;

module.exports = Site;
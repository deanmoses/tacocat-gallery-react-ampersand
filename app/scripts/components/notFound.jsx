/** @jsx React.DOM */
'use strict';

//
// React.js components that render the 404 not found page
//

var Config = require('../config.js');
var Site = require('./site.jsx');
var React = require('react');

/**
 * The React.js component that renders the 404 Not Found page.
 */
class NotFoundPage extends React.Component {
	render() {
        var divStyle = {
            textAlign: 'center'
        };
        var pStyle = {
            paddingTop : '2em'
        };

		return (
            <Site.Page hideFooter={true}>
                <Site.HeaderTitle title={Config.site_title} shortTitle={Config.site_title_short} noTitleLink={true} hideSiteTitle={true} path=''/>
				<div className='noresults' style={divStyle}>
                    That's not a valid page.
                    <p style={pStyle}>
                        <a href='#'>Go back <Site.GlyphIcon glyph='home'/>?</a>
                    </p>
                </div>
            </Site.Page>
		);
	}
}
module.exports = NotFoundPage;
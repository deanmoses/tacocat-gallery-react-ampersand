/** @jsx React.DOM */
'use strict';

var DateUtils = require('../utils/date.js');
var React = window.React = require('react');

// all the components in this file will be added to Thumb, 
// which will then be made available as a module
var Thumb = {};

/**
 * Component that displays a list of thumbnails.
 * The list could be of either albums or images.
 */
Thumb.List = React.createClass({
    render: function () {
		var isAlbum = this.props.isAlbum;
		var sectionText = isAlbum ? 'Albums' : 'Photos';
        var thumbs = this.props.items.map(function (child) {
            return <Thumb.Nail item={child} isAlbum={isAlbum} key={child.path}/>;
        });

        return (
        	<section className='thumbnails'>
				<h1 className='hidden'>{sectionText}</h1>
				{thumbs}
			</section>
        );
    }
});

/**
 * Component that displays a thumbnail of either an album or an image.
 */
Thumb.Nail = React.createClass({
	render: function() {
		var item = this.props.item;
		var width = 200;
		var height = 200;
		var title = this.props.isAlbum ? DateUtils.shortDate(item.date) : item.title;
		var summary = item.summary;
		width = width + 'px';
		height = height + 'px';
		var style = {
			width: width
		};

		var thumbUrl = 'http://tacocat.com/' + item.urlThumb;
		return(
			<span className='thumbnail'>
				<a href={'#'+item.path}>
					<img src={thumbUrl} width={width} height={height} alt={title}/>
				</a>
				<a href={'#'+item.path}>
					<span className='thumb-caption' style={style}>{title}</span>
				</a>
				{summary ? <p style={style}>{summary}</p> : ''}
			</span>
		);
	}
});

module.exports = Thumb;
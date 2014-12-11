/** @jsx React.DOM */
'use strict';

var DateUtils = require('../utils/date.js');
var React = require('react');

// all the components in this file will be added to Thumb,
// which will then be made available as a module
var Thumb = {};

/**
 * Component that displays a list of thumbnails.
 * The list could be of either albums or images.
 */
Thumb.List = React.createClass({
    render: function () {
		if (!this.props.items) {
			return false;
		}
		var isAlbum = this.props.isAlbum;
		var sectionText = isAlbum ? 'Albums' : 'Photos';
        var thumbs = this.props.items.map(function (child) {
            return <Thumb.Nail item={child} isAlbum={isAlbum} albumType={this.props.albumType} key={child.path}/>;
        }.bind(this));

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
		if (!item) {
			return false;
		}
		var width = 200;
		var height = 200;
		var title;
		if (this.props.isAlbum) {
			if (this.props.albumType === 'root') {
				title = DateUtils.year(item.date);
			}
			else {
				title = DateUtils.shortDate(item.date);
			}
		}
		else {
			title = item.title;
		}

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

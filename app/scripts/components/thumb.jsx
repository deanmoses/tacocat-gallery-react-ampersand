/** @jsx React.DOM */
'use strict';

var DateUtils = require('../utils/date.js');
var StringUtils = require('../utils/string.js');
var Site = require('./site.jsx');
var React = require('react');

// all the components in this file will be added to Thumb,
// which will then be exported as a module
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
            if (this.props.editMode) {
                var selected = this.props.editMode && !!this.props.selectedItem && StringUtils.endsWith(child.path, this.props.selectedItem);
                return <Thumb.Nail item={child} isAlbum={isAlbum} albumType={this.props.albumType} key={child.path} editMode={this.props.editMode} selected={selected} onSelect={this.onSelect.bind(this, child.path)} />;
            }
            else {
                return <Thumb.Nail item={child} isAlbum={isAlbum} albumType={this.props.albumType} key={child.path}/>;
            }
        }.bind(this));

        return (
        	<section className='thumbnails'>
				<h1 className='hidden'>{sectionText}</h1>
				{thumbs}
			</section>
        );
    },
    onSelect: function(selectKey) {
        if (this.props.onSelect) {
            this.props.onSelect(selectKey);
        }
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
        width = width + 'px';
        height = height + 'px';
        var style = {
            width: width
        };
        var imgLinkStyle = {
            width: width,
            height: height
        };
        var summary = !item.summary ? '' : <p className='thumb-summary' style={style}>{item.summary}</p>;
        var selectedClass = (!this.props.editMode || !this.props.selected) ? '' : ' selected';
        var selectButton = (!this.props.editMode) ? '' : <Site.GlyphIcon glyph='star' onClick={this.onSelect}/>;
		var thumbUrl = 'http://tacocat.com/' + item.urlThumb;
		return(
			<span className={'thumbnail' + selectedClass}>
				<a href={'#'+item.path} className='thumb-link' style={imgLinkStyle}><img src={thumbUrl} width={width} height={height} alt={title}/></a>
                {selectButton}
				<a href={'#'+item.path}><span className='thumb-caption' style={style}>{title}</span></a>
				{summary}
			</span>
		);
	},

    onSelect: function() {
        if (this.props.onSelect) {
            this.props.onSelect();
        }
    }
});

module.exports = Thumb;

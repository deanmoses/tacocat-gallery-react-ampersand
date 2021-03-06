/** @jsx React.DOM */
'use strict';

var DateUtils = require('../utils/date.js');
var StringUtils = require('../utils/string.js');
var Site = require('./site.jsx');
var Config = require('../config.js');
var React = require('react');

// all the components in this file will be added to Thumb,
// which will then be exported as a module
var Thumb = {};

/**
 * Component that displays a list of thumbnails.
 * The list could be of either albums or images.
 */
class List extends React.Component {
    render() {
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
                return <Thumb.Nail item={child} isAlbum={isAlbum} albumType={this.props.albumType} key={child.path} useLongDateAsSummary={this.props.useLongDateAsSummary} useLongDateAsTitle={this.props.useLongDateAsTitle}/>;
            }
        }.bind(this));

        return (
        	<section className='thumbnails'>
				<h1 className='hidden'>{sectionText}</h1>
				{thumbs}
			</section>
        );
    }

    onSelect(selectKey) {
        if (this.props.onSelect) {
            this.props.onSelect(selectKey);
        }
    }
}
Thumb.List = List;

/**
 * Component that displays a thumbnail of either an album or an image.
 */
class Nail extends React.Component {
	constructor() {
		this.onSelect = this.onSelect.bind(this);
	}
	
	render() {
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
            else if (this.props.albumType === 'latest') {
                title = DateUtils.longDate(item.date);
            }
            else {
                title = DateUtils.shortDate(item.date);
            }
        }
        else if (this.props.useLongDateAsTitle) {
            title = DateUtils.longDate(item.date);
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
        var summary = item.summary;
        if (!summary && this.props.useLongDateAsSummary) {
            summary = DateUtils.longDate(item.date);
        }
        summary = !summary ? '' : <p className='thumb-summary' style={style}>{summary}</p>;

        var selectedClass = (!this.props.editMode || !this.props.selected) ? '' : ' selected';
        var selectButton = (!this.props.editMode) ? '' : <Site.GlyphIcon glyph='star' onClick={this.onSelect}/>;
		var thumbUrl = Config.cdnHost() + item.urlThumb;
		return(
			<span className={'thumbnail' + selectedClass}>
				<a href={'#'+item.path} className='thumb-link' style={imgLinkStyle}><img src={thumbUrl} width={width} height={height} alt={title}/></a>
                {selectButton}
				<a href={'#'+item.path}><span className='thumb-caption' style={style}>{title}</span></a>
				{summary}
			</span>
		);
	}

    onSelect() {
        if (this.props.onSelect) {
            this.props.onSelect();
        }
    }
}
Thumb.Nail = Nail;

module.exports = Thumb;
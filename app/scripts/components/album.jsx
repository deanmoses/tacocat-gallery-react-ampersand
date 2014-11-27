/** @jsx React.DOM */

//
// React.js components that render album screens
//

var Site = require('./site.jsx'); // other React.js components these components depend on

var React = window.React = require('react');

// The component called by the router when rendering any album
var AlbumPage = React.createClass({
	render: function() {
		switch (this.props.album.type) {
			case 'root':
				return (
					<RootAlbumPage album={this.props.album}/>
				);
			case 'year':
				return (
					<YearAlbumPage album={this.props.album}/>
				);
			case 'week':
				return (
					<WeekAlbumPage album={this.props.album}/>
				);
			default:
				throw 'no such type: ' + this.props.album.type;
		 }
	}
});

module.exports = AlbumPage;

// Displays the root album (i.e., displays each year as a thumbnail)
var RootAlbumPage = React.createClass({
	render: function() {
		return (
			<div>
				<Site.HeaderTitle title={this.props.album.title} />
				<Thumbnails album={this.props.album}/>
			</div>
		);
	}
});

// Displays a year album (like 2014)
var YearAlbumPage = React.createClass({
	render: function() {
		var a = this.props.album.attributes;
		return (
			<div>
				<Site.HeaderTitle href={a.parentAlbumPath} title={a.fulltitle} />
				<Site.HeaderButtons>
					<Site.UpButton href={a.parentAlbumPath} title={a.parentAlbumPath} />
				</Site.HeaderButtons>
				<FirstsAndThumbs album={this.props.album}/>
			</div>
		);
	}
});

// Displays a week album (like 2014/12-31/)
var WeekAlbumPage = React.createClass({
	render: function() {
		var a = this.props.album.attributes;
		return (
			<div>
				<Site.HeaderTitle href={a.parentAlbumPath} title={a.fulltitle} />
				<Site.HeaderButtons>
					<Site.UpButton href={a.parentAlbumPath} title={a.parentAlbumPath} />
				</Site.HeaderButtons>
				<AlbumDescription description={a.description}/>
				<Thumbnails album={this.props.album}/>
			</div>
		);
	}
});

var AlbumDescription = React.createClass({
	render: function() {
		return (
			<section className="caption container">
				<h1 className="hidden">Overview</h1>
				<span className="caption" dangerouslySetInnerHTML={{__html: this.props.description}}/>
			</section>
		);
	}
});

var FirstsAndThumbs = React.createClass({
	render: function() {
		var a = this.props.album.attributes;
		return (
			<div className="container">
				<section className="firsts">
					FIRSTS GO HERE
				</section>
				<MonthThumbs album={this.props.album}/>
			</div>
		);
	}
});

var MonthThumbs = React.createClass({
    render: function () {

        var months = this.props.album.childAlbumsByMonth.map(function (child) {
            return <MonthThumb month={child} />;
        });

        return (
        	<div>
        		{months}
			</div>
        );
    }
});

var MonthThumb = React.createClass({
    render: function () {
    	var month = this.props.month;
        var thumbs = month.albums.map(function (child) {
            return <Thumbnail item={child} />;
        });

        return (
        	<section className="month">
				<h1>{month.monthName}</h1>
				{thumbs}
			</section>
        );
    }
});

var Thumbnails = React.createClass({
    render: function () {

        var thumbs = this.props.album.albums.map(function (child) {
            return <Thumbnail item={child} />;
        });

        return (
        	<section className="thumbnails">
				<h1 className="hidden">Pictures</h1>
				{thumbs}
			</section>
        );
    }
});

var Thumbnail = React.createClass({
	render: function() {
		var item = this.props.item;
		debugger;
		var url = '#album/' + item.path;
		var width = 200;
		var height = 200;
		var title = item.title;
		var summary = item.summary;
		width = width + 'px';
		height = height + 'px';
		var style = {
			width: width,
		}
		var thumbUrl = 'http://tacocat.com/' + item.thumb.url;
		return(
			<span className="thumbnail">
				<a href={url}>
					<img src={thumbUrl} width={width} height={height} alt={title}/>
				</a>
				<a href={url}>
					<span className="thumb-caption" style={style}>{title}</span>
				</a>
				{summary ? <p style={style}>{summary}</p> : ''}
			</span>
		);
	}
});
/** @jsx React.DOM */
'use strict';

//
// React.js components that render photo album screens
//

var AlbumStore = require('../album_store.js');
var Site = require('./site.jsx'); // other React.js components these components depend on
var React = window.React = require('react');

/**
 * The React.js component that renders an album.
 *
 * This is the only component in this module that is exported:
 * it's called by the router to render an album.
 */
var AlbumPage = React.createClass({
	
	/**
	 * Declare the properties that this component takes.
	 */
	propTypes: {
		// path to album, like '2014/12-31'
	    albumPath: React.PropTypes.string.isRequired
	},
	
	/** 
	 * Initial state of the component.
	 * Invoked once before the component is mounted. 
	 * The return value will be used as the initial value of this.state.
	 */
	getInitialState: function() {
		// console.log('getInitialState ' + this.props.albumPath);
		
		return {
			// Get the album if it already exists client-side.
			// Does NOT fetch it from server.
			// No album: component will show a waiting... indicator.
			// This is Ampersand Collection.get().
			album: AlbumStore.get(this.props.albumPath)
		};
	},

	/**
	 * Invoked after the component is mounted into the DOM.
	 *
	 * Invoked once, immediately after the initial rendering occurs. 
	 * At this point in the lifecycle, the component has a DOM 
	 * representation which you can access via this.getDOMNode().
	 *
	 * This is the place to send AJAX requests.
	 */
	componentDidMount: function() {
		// console.log('componentDidMount ' + this.props.albumPath);	
		
		// If getInitialState() didn't get the album Model from the 
		// client side cache, now's the time to fetch it from the server.
		// This is Ampersand Collection.fetchById().
		if (!this.state.album) {
			AlbumStore.fetchById(this.props.albumPath, function (err, album) {
				if (err) {
					console.log('error getting album', err);
				} 
				else {
					console.log('success getting album ' + album.path);
					if (this.isMounted()) {
						this.setState({
							album: album
						});
					}
				}
			}.bind(this));
		}
	},

	/**
	 * Render the component
	 */
	render: function() {
		var album = this.state.album;
		document.title = album ? album.pageTitle : 'Loading album...';
		
		// console.log('render(): ' + document.title);

		var type = album ? album.type : 'loading';
		switch (type) {
			case 'root':
				return (
					<RootAlbumPage album={album}/>
				);
			case 'year':
				return (
					<YearAlbumPage album={album}/>
				);
			case 'week':
				return (
					<WeekAlbumPage album={album}/>
				);
			case 'loading':
				return (
					<LoadingAlbumPage/>
				);
			default:
				throw 'no such type: ' + album.type;
		 }
	}
});

module.exports = AlbumPage;

/**
 * Component that displays an empty album, for use while the real album is
 * being loaded from the server.
 */
var LoadingAlbumPage = React.createClass({
	render: function() {
		var emptyThumbArray = [];
		return (
			<div className='albumpage loading container'>
				<Site.HeaderTitle title=''>
					<Site.PrevButton />						
					<Site.UpButton />
					<Site.NextButton />
				</Site.HeaderTitle>
				<Thumbnails items={emptyThumbArray} isAlbum={true} />
			</div>
		);
	}
});

/**
 * Component that displays the root album (i.e., displays each year as a thumbnail)
 */
var RootAlbumPage = React.createClass({
	render: function() {
		var a = this.props.album;
		return (
			<div className='albumpage rootalbumtype container'>
				<Site.HeaderTitle title={a.pageTitle}/>
			
				<h3>Latest Album:</h3>
				<Thumbnail item={a.latest} isAlbum={true}/>
				<Thumbnails items={a.albums} isAlbum={true}/>
			</div>
		);
	}
});

/**
 * Component that displays a year album (like 2014)
 */
var YearAlbumPage = React.createClass({
	render: function() {
		var a = this.props.album;
		return (
			<div className={'albumpage yearalbumtype container-fluid y'+this.props.album.title}>
				<Site.HeaderTitle href='#' title={a.pageTitle}/>
				<Years/>
				<FirstsAndThumbs album={a}/>
			</div>
		);
	}
});

var Years = React.createClass({
	render: function() {
		return (
			<nav className='years'>
				<h1 className='hidden'>Years</h1>
				<a href='#v/2014'>2014</a>
			   	<a href='#v/2013'>2013</a>
			    <a href='#v/2012'>2012</a>
			    <a href='#v/2011'>2011</a>
			    <a href='#v/2010'>2010</a>
			    <a href='#v/2009'>2009</a>
			    <a href='#v/2008'>2008</a>
			    <a href='#v/2007'>2007</a>
			    <a href='#v/2006'>2006</a>
			    <a href='#v/2005'>2005</a>
			    <a href='#v/2004'>2004</a>
			    <a href='#v/2003'>2003</a>
			    <a href='#v/2002'>2002</a>
			    <a href='#v/2001'>2001</a>
			    <a href='/pix/1973/dean/index.php'>1973</a>
			</nav>
		);
	}
});

/**
 * Component that displays a week album (like 2014/12-31/)
 */
var WeekAlbumPage = React.createClass({
	render: function() {
		var a = this.props.album;
		return (
			<div className='albumpage weekalbumtype container'>
				<Site.HeaderTitle href={'#'+a.parent_album.path} title={a.pageTitle}>
					<Site.PrevButton href={a.nextAlbumHref} title={a.nextAlbumTitle} />
					<Site.UpButton href={a.parentAlbumHref} title={a.parentAlbumTitle} />
					<Site.NextButton href={a.prevAlbumHref} title={a.prevAlbumTitle}/>
				</Site.HeaderTitle>
				<AlbumDescription description={a.description}/>
				<Thumbnails items={a.images} isAlbum={false} />
			</div>
		);
	}
});

/**
 * Component that displays the Album's description
 */
var AlbumDescription = React.createClass({
	render: function() {
		return (
			<section className='caption'>
				<h1 className='hidden'>Overview</h1>
				<span className='caption' dangerouslySetInnerHTML={{__html: this.props.description}}/>
			</section>
		);
	}
});

/**
 * Component for year pages.  
 * Displays the year's firsts and the child albums' thumbnails
 */
var FirstsAndThumbs = React.createClass({
	render: function() {
		var a = this.props.album;
		return (
			<div>
				<section className='col-md-3 firsts'>
					<h2 className='hidden'>Firsts</h2>
				    FIRSTS GO HERE
				</section>
				<section className='col-md-9'>
					<MonthThumbs album={a}/>
				</section>
			</div>
		);
	}
});

/**
 * Component for year pages.  
 * Displays the thumbnail of each individual week album in the year.
 */
var MonthThumbs = React.createClass({
    render: function () {

        var months = this.props.album.childAlbumsByMonth.map(function (child) {
            return <MonthThumb month={child} key={child.monthName}/>;
        });

        return (
        	<div>
        		{months}
			</div>
        );
    }
});

/**
 * Component for year pages. 
 * Displays the thumbnails of each individual week album in a given month.
 */
var MonthThumb = React.createClass({
    render: function () {
    	var month = this.props.month;
        var thumbs = month.albums.map(function (child) {
            return <Thumbnail item={child} isAlbum={true} key={child.path}/>;
        });

        return (
        	<section className='month'>
				<h1>{month.monthName}</h1>
				{thumbs}
			</section>
        );
    }
});

/**
 * Displays the thumbnails of an album.
 * Component shared by the root album and week albums, but not year albums.
 */
var Thumbnails = React.createClass({
    render: function () {
		var isAlbum = this.props.isAlbum;
        var thumbs = this.props.items.map(function (child) {
            return <Thumbnail item={child} isAlbum={isAlbum} key={child.path}/>;
        });

        return (
        	<section className='thumbnails'>
				<h1 className='hidden'>Pictures</h1>
				{thumbs}
			</section>
        );
    }
});

/**
 * Displays a thumbnail of either an album or an image.
 */
var Thumbnail = React.createClass({
	render: function() {
		var item = this.props.item;
		var width = 200;
		var height = 200;
		var title = item.title;
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
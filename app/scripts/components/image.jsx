/** @jsx React.DOM */

//
// React.js components that render the photo detail screen
//

var AlbumStore = require('../album_store.js');
var Site = require('./site.jsx'); // other React.js components these components depend on
var React = window.React = require('react');

/**
 * The React.js component that renders the photo detail screen.
 *
 * This is the only component in this module that is exported:
 * it's called by the router to render an album.
 */
var ImagePage = React.createClass({
	
	/**
	 * Declare the properties that this component takes.
	 */
	propTypes: {
		// path to image, like '2014/12-31/felix.jpg'
	    imagePath: React.PropTypes.string.isRequired
	},
	
	/** 
	 * Initial state of the component.
	 * Invoked once before the component is mounted. 
	 * The return value will be used as the initial value of this.state.
	 */
	getInitialState: function() {
		// console.log('getInitialState ' + this.props.imagePath);
		
		// get the album's path from the photo's path
		var pathParts = this.props.imagePath.split('/');
		pathParts.pop(); // remove photo filename
		var albumPath = pathParts.join('/');
		
		return {
			// Get the album if it already exists client-side.
			// Does NOT fetch it from server.
			// No album: component will show a waiting... indicator.
			// This is Ampersand Collection.get().
			album: AlbumStore.get(albumPath),
			albumPath: albumPath
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
		// console.log('componentDidMount ' + this.props.imagePath);	
		
		// If getInitialState() didn't get the album Model from the 
		// client side cache, now's the time to fetch it from the server.
		// This is Ampersand Collection.fetchById().
		if (!this.state.album) {
			AlbumStore.fetchById(this.state.albumPath, function (err, album) {
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
	
	render: function() {
		// console.log('render ' + this.props.imagePath);
		
		var album = this.state.album;
		if (album) {
			var image = album.images.get(this.props.imagePath);
			document.title = image.title;
			return (
				<ImagePageNotWaiting album={album} image={image} />
			);
		} 
		else {
			document.title = 'Loading album...';
			return (
				<ImagePageWaiting />
			);
		}
	}
});

module.exports = ImagePage;

/**
 * Component that displays an empty image, for use while the album is
 * being loaded from the server.
 */
var ImagePageWaiting = React.createClass({
	render: function() {
		return (
			<div>
				<Site.HeaderTitle title='' />
				<Site.HeaderButtons>
					<div className="btn-group">
						<Site.PrevButton />
						<Site.UpButton title='' />
						<Site.NextButton />
					</div>
				</Site.HeaderButtons>
				<ImagePageBodyWaiting />				
			</div>
		);
	}
});

/**
 * Component that displays an empty image body, for use while the album is
 * being loaded from the server.
 */
var ImagePageBodyWaiting = React.createClass({
	render: function() {
		return (
			<div className="container-fluid photo-body">
				<section className="col-md-3">
					<h2 className="hidden">Caption</h2>
				    <span className="caption">...</span>
				</section>
				<section className="col-md-9">
					<h2 className="hidden">Photo</h2>
				</section>
			</div>
		);
	}
});

/**
 * Component that displays the real image.
 */
var ImagePageNotWaiting = React.createClass({

	propTypes: {
		album: React.PropTypes.object.isRequired,
	    image: React.PropTypes.object.isRequired
	},
	
	render: function() {
		var album = this.props.album;
		var image = this.props.image;

		return (
			<div>
				<Site.HeaderTitle href={album.href} title={image.title}>
					<Site.PrevButton href={image.prevImageHref} />
					<Site.UpButton href={album.href} title={album.title} />
					<Site.NextButton href={image.nextImageHref} />
				</Site.HeaderTitle>
				<ImagePageBody image={image} />
			</div>
		);
	}
});

/**
 * Component that displays the body of the image page.
 */
var ImagePageBody = React.createClass({
	propTypes: {
	    image: React.PropTypes.object.isRequired
	},
	
	render: function() {
		var image = this.props.image;
		var style = {
			'width': '100%',
			'maxWidth': image.width,
			'maxHeight': image.height
		};
		return (
			<div className="container-fluid photo-body">
				<section className="col-md-3">
					<h2 className="hidden">Caption</h2>
				    <span className="caption" dangerouslySetInnerHTML={{__html: image.description}}/>
				</section>
				<section className="col-md-9">
					<h2 className="hidden">Photo</h2>
					<img src={'http://tacocat.com' + image.urlSized} style={style} />
				</section>
			</div>
		);
	}
});

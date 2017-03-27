/** @jsx React.DOM */
'use strict';

//
// React.js components that render the photo detail screen
//

var $ = require('jquery'); // must be before bootstrap-dropdown
require('bootstrap-dropdown'); // must be after jquery
var Config = require('../config.js');
var AlbumStore = require('../models/album_store.js');
var User = require('../models/user.js');
var RichTextEditor = require('./richText.jsx');
var Site = require('./site.jsx'); // other React.js components these components depend on
var React = require('react');
var ReactDOM = require('react-dom');

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

    render: function() {
        var album = this.state.album;
        if (album) {
            var image = album.images.get(this.props.imagePath);
            document.title = image.title;
            return (
                <ImagePageNotWaiting album={album} image={image} user={User.currentUser()}/>
            );
        }
        else {
            document.title = 'Loading album...';
            return (
                <ImagePageWaiting />
            );
        }
    },

	/**
	 * Initial state of the component.
	 * Invoked once before the component is mounted.
	 * The return value will be used as the initial value of this.state.
	 */
	getInitialState: function() {
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
			albumPath: albumPath,
            editMode: User.currentUser().editMode,
            editAllowed: User.currentUser().isAdmin
		};
	},

    /**
     * Invoked once, before component is mounted into the DOM, before initial rendering.
     */
    componentWillMount: function() {
        // Start listening for changes to the user model.

        // When the user gets logged in, this triggers rerendering
        // so the edit button gets drawn.
        User.currentUser().on('change:isAdmin', function() {
            if (this.isMounted()) {
                this.setState({editAllowed: User.currentUser().isAdmin});
            }
        }, this);

        // When the user clicks edit, edit mode on the user is set.
        // Listen for that so we know to draw the edit controls.
        User.currentUser().on('change:editMode', function() {
            if (this.isMounted()) {
                this.setState({editMode: User.currentUser().editMode});
            }
        }, this);
    },

    /**
     * Invoked immediately before a component is unmounted from the DOM.
     */
    componentWillUnmount: function() {
        // Stop listening for changes to the User model
        User.currentUser().off('change:isAdmin');
        User.currentUser().off('change:editMode');
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
		// If getInitialState() didn't get the album Model from the
		// client side cache, now's the time to fetch it from the server.
		// This is Ampersand Collection.fetchById().
		if (!this.state.album) {
			AlbumStore.fetchById(this.state.albumPath, function (err, album) {
				if (err) {
                    // TODO: handle error better than an alert()
                    alert('error getting album: ' + err);
					console.log('error getting album', err);
				}
				else {
					//console.log('success getting album ' + album.path);
					if (this.isMounted()) {
						this.setState({
							album: album
						});
					}
				}
			}.bind(this));
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
            <Site.Page className='imagepage waiting' hideFooter={true}>
                <Site.HeaderTitle title='' hideSiteTitle={true} hideSearch={true}/>
                <div className='photo-body'>
                    <section className='col-md-3'>
                        <h2 className='hidden'>Caption</h2>
                        <div className='caption'></div>
                    </section>
                    <section className='col-md-9'>
                        <h2 className='hidden'>Photo</h2>
                        <Site.HeaderButtons>
                            <Site.PrevButton />
                            <Site.UpButton />
                            <Site.NextButton/>
                        </Site.HeaderButtons>
                    </section>
                </div>
            </Site.Page>
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
			<Site.Page className='imagepage'>
				<Site.HeaderTitle href={album.href} title={image.title} editMode={this.props.user.editMode} hideSiteTitle={true} hideSearch={true}/>
				<ImagePageBody album={album} image={image} editMode={this.props.user.editMode}/>
				<EditMenu album={album} image={image} allowEdit={this.props.user.isAdmin} editMode={this.props.user.editMode}/>
			</Site.Page>
		);
	}
});

/**
 * Component that displays the body of the image page.
 */
var ImagePageBody = React.createClass({
	propTypes: {
	    image: React.PropTypes.object.isRequired,
		album: React.PropTypes.object.isRequired,
        editMode: React.PropTypes.bool
	},

	render: function() {
		var image = this.props.image;
		var album = this.props.album;
        var fullSizeUrl = Config.zenphotoImageFullSizeUrl(image.path);
		var orientation = image.isPortrait ? 'portrait' : 'landscape';
		var style = {
			'maxWidth': image.width,
			'maxHeight': image.height
		};
		if (image.isPortrait) {
			style.height = '100%';
		}
		else {
			style.width = '100%';
		}

        var desc = (this.props.editMode)
            ? <RichTextEditor valueToEdit={image.description}/>
            : <div className='caption' dangerouslySetInnerHTML={{__html: image.description}}/>;

		return (
			<div className='photo-body container-fluid'>
				<section className='col-md-3'>
					<h2 className='hidden'>Caption</h2>
                    {desc}
				</section>
				<section className='col-md-9'>
					<h2 className='hidden'>Photo</h2>
					<Site.HeaderButtons>
						<Site.PrevButton href={image.prevImageHref} />
						<Site.UpButton href={album.href} title={album.pageTitle} />
						<Site.NextButton href={image.nextImageHref} />
					</Site.HeaderButtons>
					<a href={fullSizeUrl} target='zen'><img src={'http://tacocat.com' + image.urlSized} style={style} className={'thephoto ' + orientation} onLoad={this.onImgLoad}/></a>
				</section>
			</div>
		);
	},

    onImgLoad: function(e) {
        $(e.target).css('min-height', '');
    },

	/**
	 * Invoked after the component is mounted into the DOM.
	 *
	 * Invoked once, immediately after the initial rendering occurs.
	 * At this point in the lifecycle, the component has a DOM
	 * representation which you can access via this.getDOMNode().
	 */
	componentDidMount: function() {
		// Hook up the image resizing
        this.resizeImage(
			// image
			'.photo-body img',
			// container to fit image into
			'.photo-body .col-md-9'
		);
	},

	/**
	 * Continuously resize an image to best fit the HTML element that it
     * lives inside of.
     *
     * @param imageExpression css/jQuery expression targeting the image
     * @param containerExpression css/jQuery expression targeting the container in which the image lives
	 */
	resizeImage : function(imageExpression, containerExpression) {
		var image = $(imageExpression);
		var container = $(containerExpression);
		var _this = this;

		image.on('load', function() {
			//console.log('imageUtil.resizeImage(): img loaded');
			_this.resizeImageOnce(image, container);
		});  // on initial image load (won't be called if it's already loaded)
		//$(function(){ _this.resizeImageOnce(image, container); });  // on initial page load
		$(window).resize(function() { _this.resizeImageOnce(image, container); });  // on window resize
	},

	/**
	 * Resize an image to best fit the HTML element in which it lives.
	 */
	resizeImageOnce : function(image, container) {

		// get image width and height
		var imgWidth = image.width();
		var imgHeight = image.height();

		if (imgWidth <= 0 || imgHeight <= 0) {
			return;
		}

		// get container width and height
		var containerWidth = container.width();
		var containerHeight = container.height();

		if (containerWidth <= 0 || containerHeight <= 0) {
			return;
		}

		// calculate image height if we resized to 100% width
		var newImgHeight = Math.round(containerWidth * (imgHeight / imgWidth));

		// if new image height fits within container, we've got our dimensions
		if (newImgHeight <= containerHeight) {
			//console.log('width based.  container w: ' + containerWidth + ' > ' + container.parent().width() + ' > ' + container.parent().width());
			image.width(containerWidth);
			image.height(newImgHeight);
		}
		// else if new image height is too tall for container,
		// make image height 100% of container
		else {
			//console.log('height based');
			image.height(containerHeight);
			image.width(Math.round(containerHeight * (imgWidth / imgHeight)));
		}

		image.css('display', 'block');

		// update header width to match image
		//$('.header-container header').width(image.width());
	}

});

/**
 * Component that renders the admin's image edit controls.
 */
var EditMenu = React.createClass({
    propTypes: {
        album: React.PropTypes.object.isRequired,
        image: React.PropTypes.object.isRequired,
        allowEdit: React.PropTypes.bool.isRequired,
        editMode: React.PropTypes.bool.isRequired
    },

	render: function() {

        // if user isn't allowed to edit, render nothing
        if (!this.props.allowEdit) {
            return false;
        }
        // else if we're in the middle of saving, say so and don't draw any buttons
        else if (this.state.step === 'saving') {
            return (
                <div>
                    Saving...
                </div>
            );
        }
        // else if we're in edit mode, give controls to save and cancel
		else if (this.props.editMode) {
            var saveMessage = this.state.step === 'saved' ? <span className='editStatusMsg'>Saved.</span> : '';
            return (
                <div>
                    <div className='btn-group'>
                        <button type='button' className='btn btn-default' onClick={this.cancel} title='Leave edit mode'><Site.GlyphIcon glyph='remove'/> Cancel</button>
                        <button type='button' className='btn btn-default' onClick={this.save}><Site.GlyphIcon glyph='ok'/> Save</button>
                        <button type='button' className='btn btn-default' onClick={this.saveNext} title='Save and go to next image'><Site.GlyphIcon glyph='arrow-right'/> Next</button>
                    </div>
                    {saveMessage}
                </div>
            );
		}
        // else user is allowed to edit but isn't currently editing.  Give them an edit button.
		else {
            var image = this.props.image;
            var zeditUrl = Config.zenphotoImageEditUrl(image.albumPath, image.filename);
            var zviewUrl = Config.zenphotoImageViewUrl(image.path);
            return (
                <div>
                    <div className='btn-group'>
                        <button type='button' className='btn btn-default' onClick={this.edit}><Site.GlyphIcon glyph='pencil'/> Edit</button>
                        <button type='button' className='btn btn-default dropdown-toggle' data-toggle='dropdown' aria-expanded='false'>
                            <span className='caret'></span>
                            <span className='sr-only'>Toggle Dropdown</span>
                        </button>
                        <ul className='dropdown-menu' role='menu'>
                            <li><a href={zeditUrl} target='zen' title='Edit in Zenphoto'><Site.GlyphIcon glyph='new-window'/> Full Edit</a></li>
                            <li><a href={zviewUrl} target='zen' title='View in Zenphoto'><Site.GlyphIcon glyph='eye-open'/> Full View</a></li>
                        </ul>
                    </div>
                </div>
            );
		}
	},

    getInitialState: function() {
        return {
            step: ''
        };
    },

    /**
     * Enter edit mode
     */
	edit: function() {
        // will trigger the event listener in a parent component
        User.currentUser().editMode = true;
	},

    /**
     * Cancel edit mode
     */
	cancel: function() {
        // will trigger the event listener in a parent component
        User.currentUser().editMode = false;
	},

    /**
     * Save to server and then go to the next image
     */
    saveNext: function() {
        this.save(true);
    },

    /**
	 * Save to server
	 */
	save: function(next) {
        var titleInputElement = $('.titleInput');
        if (!titleInputElement.length) {
            alert('image save: could not find title input element');
            return;
        }
        var descInputElement = $('.caption');
        if (!descInputElement.length) {
            alert('image save: could not find description input element');
            this.setState({step: ''});
            return;
        }

		var title = titleInputElement.text().trim();
		var description = descInputElement.html();

        if (!title) {
            alert('Title cannot be blank');
            return;
        }

        // If there's no actual text, but maybe some <p> or <br>,
        // set it to blank.
        if (!descInputElement.text().trim()) {
            description = '';
        }

		console.log('title', title);
		console.log('desc', description);

        this.setState({step: 'saving'});

		var ajaxData = {
			eip_context	: 'image',
			title: title,
			desc: description
		};

		$.ajax({
			type: "POST",
			url: Config.zenphotoImageViewUrl(this.props.image.path),
			cache: false,
			dataType: "text",
			data: ajaxData
		})
		.done(function() {
            // set the title and description on the image model
			this.props.image.title = title;
			this.props.image.description = description;
            if (next === true) {
                // if no next image, go up to the album
                window.location.hash = (this.props.image.nextImageHref) ? this.props.image.nextImageHref : this.props.album.href;
            }
            else {
                this.setState({step: 'saved'});
            }
		}.bind(this))
		.fail(function(jqXHR, textStatus, errorThrown) {
			console.log('error saving image: %s\n\tstatus: %s\n\txhr: %s', errorThrown, textStatus, jqXHR);
            alert('Error saving: ' + errorThrown);
            this.setState({step: ''});
		}.bind(this));
	}
});
